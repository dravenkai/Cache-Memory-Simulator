import { describe, expect, it } from "vitest";
import {
  ADDRESS_BITS,
  CacheConfig,
  MAX_ADDRESS,
  accessCache,
  createCache,
  formatHex,
  parseAddress,
  validateConfig,
  waysFor,
} from "./cache-sim";

function config(overrides: Partial<CacheConfig> = {}): CacheConfig {
  return {
    cacheSize: 1024,
    blockSize: 16,
    mapping: "direct",
    replacement: "LRU",
    associativity: 4,
    ...overrides,
  };
}

describe("waysFor", () => {
  it("is always 1 way for direct mapping", () => {
    expect(waysFor(config({ mapping: "direct" }))).toBe(1);
  });

  it("uses every line as one set for fully associative", () => {
    const c = config({ mapping: "fully-associative", cacheSize: 256, blockSize: 16 });
    expect(waysFor(c)).toBe(16); // 256 / 16 lines, all in one set
  });

  it("uses the configured associativity for set-associative", () => {
    const c = config({ mapping: "set-associative", cacheSize: 1024, blockSize: 16, associativity: 4 });
    expect(waysFor(c)).toBe(4);
  });

  it("clamps associativity down when it exceeds the number of lines", () => {
    const c = config({ mapping: "set-associative", cacheSize: 64, blockSize: 16, associativity: 8 });
    // only 4 lines exist, so 8-way is impossible
    expect(waysFor(c)).toBe(4);
  });
});

describe("validateConfig", () => {
  it("accepts the default config", () => {
    expect(validateConfig(config())).toBeNull();
  });

  it("rejects a non-power-of-two cache size", () => {
    expect(validateConfig(config({ cacheSize: 1000 }))).toMatch(/power of two/i);
  });

  it("rejects a non-power-of-two block size", () => {
    expect(validateConfig(config({ blockSize: 12 }))).toMatch(/power of two/i);
  });

  it("rejects a block size larger than the cache", () => {
    expect(validateConfig(config({ cacheSize: 16, blockSize: 32 }))).toMatch(/block size/i);
  });

  it("rejects associativity that doesn't divide the line count evenly", () => {
    const c = config({ mapping: "set-associative", cacheSize: 1024, blockSize: 16, associativity: 4 });
    // 64 lines / 4-way = fine; force an odd (non-power-of-two) associativity instead
    expect(validateConfig({ ...c, associativity: 3 })).toMatch(/power of two/i);
  });
});

describe("createCache", () => {
  it("builds the right number of sets and ways for direct mapping", () => {
    const cache = createCache(config({ cacheSize: 1024, blockSize: 16, mapping: "direct" }));
    expect(cache.numLines).toBe(64);
    expect(cache.ways).toBe(1);
    expect(cache.numSets).toBe(64);
    expect(cache.sets).toHaveLength(64);
    expect(cache.sets[0]).toHaveLength(1);
  });

  it("builds a single set for fully associative", () => {
    const cache = createCache(config({ cacheSize: 256, blockSize: 16, mapping: "fully-associative" }));
    expect(cache.numSets).toBe(1);
    expect(cache.ways).toBe(16);
  });

  it("builds numLines/associativity sets for set-associative", () => {
    const cache = createCache(
      config({ cacheSize: 1024, blockSize: 16, mapping: "set-associative", associativity: 4 })
    );
    expect(cache.numLines).toBe(64);
    expect(cache.ways).toBe(4);
    expect(cache.numSets).toBe(16);
  });

  it("throws for an invalid config instead of producing a broken cache", () => {
    expect(() => createCache(config({ cacheSize: 1000 }))).toThrow();
  });

  it("starts with every line invalid and empty", () => {
    const cache = createCache(config());
    for (const set of cache.sets) {
      for (const line of set) {
        expect(line.valid).toBe(false);
        expect(line.tag).toBeNull();
      }
    }
  });
});

describe("accessCache", () => {
  it("misses on the first access to a fresh cache", () => {
    const c = config({ mapping: "direct" });
    const cache = createCache(c);
    const { result } = accessCache(cache, c, 0x100);
    expect(result.hit).toBe(false);
  });

  it("hits on a repeated access to the same block", () => {
    const c = config({ mapping: "direct" });
    let cache = createCache(c);
    const first = accessCache(cache, c, 0x100);
    cache = first.state;
    const second = accessCache(cache, c, 0x100);
    expect(second.result.hit).toBe(true);
    expect(second.result.setIndex).toBe(first.result.setIndex);
    expect(second.result.wayIndex).toBe(first.result.wayIndex);
  });

  it("hits on any address within the same block, not just the exact byte", () => {
    const c = config({ blockSize: 16 });
    let cache = createCache(c);
    cache = accessCache(cache, c, 0x100).state; // loads block containing 0x100-0x10F
    const { result } = accessCache(cache, c, 0x10a);
    expect(result.hit).toBe(true);
  });

  it("computes tag/index/offset that reconstruct the block address", () => {
    const c = config({ cacheSize: 1024, blockSize: 16, mapping: "set-associative", associativity: 4 });
    const cache = createCache(c);
    const { result } = accessCache(cache, c, 0x1234);
    const reconstructed = result.tag * 16 /* numSets */ + result.setIndex;
    expect(reconstructed).toBe(Math.floor(0x1234 / 16));
    expect(result.offset).toBe(0x1234 % 16);
    expect(result.offsetBits + result.indexBits + result.tagBits).toBe(ADDRESS_BITS);
  });

  it("causes a conflict miss in direct mapping for two addresses in the same set", () => {
    const c = config({ cacheSize: 64, blockSize: 16, mapping: "direct" }); // 4 lines/sets
    let cache = createCache(c);
    // block 0 -> set 0; block 4 -> set 0 too (4 sets total), different tag
    cache = accessCache(cache, c, 0).state;
    const { result } = accessCache(cache, c, 4 * 16);
    expect(result.setIndex).toBe(0);
    expect(result.hit).toBe(false);
  });

  it("evicts the least-recently-used line under LRU when a set fills up", () => {
    const c = config({
      cacheSize: 32,
      blockSize: 16,
      mapping: "fully-associative",
      replacement: "LRU",
    }); // 2 lines total, one set
    let cache = createCache(c);
    cache = accessCache(cache, c, 0).state; // block 0 -> way 0
    cache = accessCache(cache, c, 16).state; // block 1 -> way 1
    cache = accessCache(cache, c, 0).state; // touch block 0 again -> now MRU
    // block 2 should evict block 1 (LRU), not block 0
    const { result, state } = accessCache(cache, c, 32);
    expect(result.hit).toBe(false);
    const stillCached = accessCache(state, c, 0);
    expect(stillCached.result.hit).toBe(true);
  });

  it("evicts the first-loaded line under FIFO regardless of recent use", () => {
    const c = config({
      cacheSize: 32,
      blockSize: 16,
      mapping: "fully-associative",
      replacement: "FIFO",
    });
    let cache = createCache(c);
    cache = accessCache(cache, c, 0).state; // loaded first
    cache = accessCache(cache, c, 16).state; // loaded second
    cache = accessCache(cache, c, 0).state; // re-touch block 0 (doesn't matter for FIFO)
    // block 2 should evict block 0 (loaded first), even though it was just touched
    const { state } = accessCache(cache, c, 32);
    const block0Again = accessCache(state, c, 0);
    expect(block0Again.result.hit).toBe(false);
  });

  it("picks a valid victim under Random replacement without crashing", () => {
    const c = config({
      cacheSize: 32,
      blockSize: 16,
      mapping: "fully-associative",
      replacement: "Random",
    });
    let cache = createCache(c);
    cache = accessCache(cache, c, 0).state;
    cache = accessCache(cache, c, 16).state;
    const { result } = accessCache(cache, c, 32);
    expect(result.hit).toBe(false);
    expect(result.wayIndex).toBeGreaterThanOrEqual(0);
    expect(result.wayIndex).toBeLessThan(2);
  });
});

describe("parseAddress", () => {
  it("parses hex addresses", () => {
    expect(parseAddress("0x10")).toBe(16);
    expect(parseAddress("0XFF")).toBe(255);
  });

  it("parses decimal addresses", () => {
    expect(parseAddress("42")).toBe(42);
  });

  it("rejects empty or whitespace-only input", () => {
    expect(parseAddress("")).toBeNull();
    expect(parseAddress("   ")).toBeNull();
  });

  it("rejects garbage input", () => {
    expect(parseAddress("not-an-address")).toBeNull();
    expect(parseAddress("0xZZZZ")).toBeNull();
  });

  it("rejects negative numbers", () => {
    expect(parseAddress("-5")).toBeNull();
  });

  it("rejects addresses beyond the address space", () => {
    expect(parseAddress(String(MAX_ADDRESS))).toBe(MAX_ADDRESS);
    expect(parseAddress(String(MAX_ADDRESS + 1))).toBeNull();
  });
});

describe("formatHex", () => {
  it("formats with a 0x prefix and uppercase digits", () => {
    expect(formatHex(255)).toBe("0x00FF");
  });

  it("pads to the requested digit count", () => {
    expect(formatHex(5, 2)).toBe("0x05");
  });
});
