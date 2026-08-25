export type MappingPolicy = "direct" | "fully-associative" | "set-associative";
export type ReplacementPolicy = "LRU" | "FIFO" | "Random";

/** Total width, in bits, of the addresses this simulator works with. */
export const ADDRESS_BITS = 16;
export const MAX_ADDRESS = 2 ** ADDRESS_BITS - 1;

export interface CacheConfig {
  cacheSize: number;
  blockSize: number;
  mapping: MappingPolicy;
  replacement: ReplacementPolicy;
  associativity: number;
}

export interface CacheLine {
  valid: boolean;
  tag: number | null;
  blockAddress: number | null;
  lastUsed: number;
  loadedAt: number;
}

export interface CacheState {
  sets: CacheLine[][];
  numSets: number;
  ways: number;
  numLines: number;
  offsetBits: number;
  clock: number;
}

export interface AccessResult {
  address: number;
  hit: boolean;
  setIndex: number;
  tag: number;
  wayIndex: number;
  blockAddress: number;
  /** Byte offset within the block (the low `offsetBits` bits of the address). */
  offset: number;
  offsetBits: number;
  indexBits: number;
  tagBits: number;
}

export const DEFAULT_CONFIG: CacheConfig = {
  cacheSize: 1024,
  blockSize: 16,
  mapping: "direct",
  replacement: "LRU",
  associativity: 4,
};

function emptyLine(): CacheLine {
  return { valid: false, tag: null, blockAddress: null, lastUsed: -1, loadedAt: -1 };
}

function isPowerOfTwo(n: number): boolean {
  return Number.isInteger(n) && n > 0 && (n & (n - 1)) === 0;
}

/**
 * Checks a config for combinations that would make the cache math
 * (bit widths, set counts) ill-defined. Returns a human-readable reason
 * when invalid, or null when the config is safe to build a cache from.
 */
export function validateConfig(config: CacheConfig): string | null {
  if (!isPowerOfTwo(config.cacheSize)) {
    return "Cache size must be a power of two.";
  }
  if (!isPowerOfTwo(config.blockSize)) {
    return "Block size must be a power of two.";
  }
  if (config.blockSize > config.cacheSize) {
    return "Block size cannot exceed cache size.";
  }
  const numLines = config.cacheSize / config.blockSize;
  if (config.mapping === "set-associative") {
    if (!isPowerOfTwo(config.associativity)) {
      return "Associativity must be a power of two.";
    }
    if (numLines % config.associativity !== 0) {
      return "Associativity must divide the total number of cache lines evenly.";
    }
  }
  return null;
}

export function waysFor(config: CacheConfig): number {
  const numLines = config.cacheSize / config.blockSize;
  if (config.mapping === "direct") return 1;
  if (config.mapping === "fully-associative") return numLines;
  return Math.max(1, Math.min(config.associativity, numLines));
}

export function createCache(config: CacheConfig): CacheState {
  const error = validateConfig(config);
  if (error) throw new Error(error);

  const numLines = config.cacheSize / config.blockSize;
  const ways = waysFor(config);
  const numSets = numLines / ways;
  const sets: CacheLine[][] = Array.from({ length: numSets }, () =>
    Array.from({ length: ways }, emptyLine)
  );
  return {
    sets,
    numSets,
    ways,
    numLines,
    offsetBits: Math.log2(config.blockSize),
    clock: 0,
  };
}

export function accessCache(
  state: CacheState,
  config: CacheConfig,
  address: number
): { state: CacheState; result: AccessResult } {
  const blockAddress = Math.floor(address / config.blockSize);
  const setIndex = blockAddress % state.numSets;
  const tag = Math.floor(blockAddress / state.numSets);
  const offset = address % config.blockSize;
  const offsetBits = state.offsetBits;
  const indexBits = Math.log2(state.numSets);
  const tagBits = Math.max(0, ADDRESS_BITS - offsetBits - indexBits);

  const sets = state.sets.map((set) => set.map((line) => ({ ...line })));
  const set = sets[setIndex];
  const clock = state.clock + 1;

  const hitIndex = set.findIndex((line) => line.valid && line.tag === tag);

  const breakdown = { offset, offsetBits, indexBits, tagBits };

  if (hitIndex !== -1) {
    set[hitIndex].lastUsed = clock;
    return {
      state: { ...state, sets, clock },
      result: { address, hit: true, setIndex, tag, wayIndex: hitIndex, blockAddress, ...breakdown },
    };
  }

  let victim = set.findIndex((line) => !line.valid);
  if (victim === -1) {
    if (config.replacement === "LRU") {
      victim = set.reduce(
        (best, line, i) => (line.lastUsed < set[best].lastUsed ? i : best),
        0
      );
    } else if (config.replacement === "FIFO") {
      victim = set.reduce(
        (best, line, i) => (line.loadedAt < set[best].loadedAt ? i : best),
        0
      );
    } else {
      victim = Math.floor(Math.random() * set.length);
    }
  }

  set[victim] = { valid: true, tag, blockAddress, lastUsed: clock, loadedAt: clock };

  return {
    state: { ...state, sets, clock },
    result: { address, hit: false, setIndex, tag, wayIndex: victim, blockAddress, ...breakdown },
  };
}

export function parseAddress(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const value = trimmed.toLowerCase().startsWith("0x")
    ? parseInt(trimmed, 16)
    : parseInt(trimmed, 10);
  return Number.isFinite(value) && value >= 0 && value <= MAX_ADDRESS ? value : null;
}

export function formatHex(value: number, digits = 4): string {
  return "0x" + value.toString(16).toUpperCase().padStart(digits, "0");
}
