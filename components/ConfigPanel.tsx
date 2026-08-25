"use client";

import { CacheConfig, MappingPolicy, ReplacementPolicy } from "@/lib/cache-sim";
import Card from "./Card";
import Select from "./Select";

const CACHE_SIZES = [256, 512, 1024, 2048, 4096];
const BLOCK_SIZES = [4, 8, 16, 32, 64];
const ASSOCIATIVITIES = [2, 4, 8];

export default function ConfigPanel({
  config,
  setConfig,
}: {
  config: CacheConfig;
  setConfig: (updater: (prev: CacheConfig) => CacheConfig) => void;
}) {
  return (
    <Card
      title="Cache Configuration"
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      }
    >
      <div className="flex flex-col gap-4">
        <Select
          label="Cache Size"
          value={config.cacheSize}
          onChange={(e) =>
            setConfig((prev) => ({ ...prev, cacheSize: Number(e.target.value) }))
          }
        >
          {CACHE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} Bytes
            </option>
          ))}
        </Select>

        <Select
          label="Block Size"
          value={config.blockSize}
          onChange={(e) =>
            setConfig((prev) => ({ ...prev, blockSize: Number(e.target.value) }))
          }
        >
          {BLOCK_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} Bytes
            </option>
          ))}
        </Select>

        <Select
          label="Mapping Policy"
          value={config.mapping}
          onChange={(e) =>
            setConfig((prev) => ({ ...prev, mapping: e.target.value as MappingPolicy }))
          }
        >
          <option value="direct">Direct Mapped</option>
          <option value="fully-associative">Fully Associative</option>
          <option value="set-associative">Set Associative</option>
        </Select>

        {config.mapping === "set-associative" && (
          <Select
            label="Associativity"
            value={config.associativity}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, associativity: Number(e.target.value) }))
            }
          >
            {ASSOCIATIVITIES.map((n) => (
              <option key={n} value={n}>
                {n}-way
              </option>
            ))}
          </Select>
        )}

        <Select
          label="Replacement Policy"
          value={config.replacement}
          onChange={(e) =>
            setConfig((prev) => ({
              ...prev,
              replacement: e.target.value as ReplacementPolicy,
            }))
          }
        >
          <option value="LRU">LRU (Least Recently Used)</option>
          <option value="FIFO">FIFO (First-In, First-Out)</option>
          <option value="Random">Random</option>
        </Select>
      </div>
    </Card>
  );
}
