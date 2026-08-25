"use client";

import { AccessResult, CacheState, formatHex } from "@/lib/cache-sim";
import Card from "./Card";

export default function CacheGrid({
  cache,
  blockSize,
  lastResult,
}: {
  cache: CacheState;
  blockSize: number;
  lastResult: AccessResult | null;
}) {
  return (
    <Card
      title="Cache Grid"
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      }
      action={
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-hit" /> HIT
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-miss" /> MISS
          </span>
        </div>
      }
    >
      <div className="max-h-96 overflow-y-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-surface-2">
            <tr className="text-left text-xs font-medium text-muted">
              <th className="px-3 py-2 font-medium">Set / Index</th>
              <th className="px-3 py-2 font-medium">Valid</th>
              <th className="px-3 py-2 font-medium">Tag</th>
              <th className="px-3 py-2 font-medium">Data (Block)</th>
            </tr>
          </thead>
          <tbody>
            {cache.sets.map((set, setIndex) => {
              const isLastSet = lastResult && lastResult.setIndex === setIndex;
              return set.map((line, wayIndex) => {
                const isLastLine = isLastSet && lastResult!.wayIndex === wayIndex;
                const rowLabel =
                  cache.ways > 1
                    ? `${formatHex(setIndex, 2)}.${wayIndex}`
                    : formatHex(setIndex, 2);
                return (
                  <tr
                    key={`${setIndex}-${wayIndex}`}
                    className={`border-t border-border transition-colors ${
                      isLastLine
                        ? lastResult!.hit
                          ? "bg-hit/10"
                          : "bg-miss/10"
                        : ""
                    }`}
                  >
                    <td className="px-3 py-2 font-mono text-foreground">{rowLabel}</td>
                    <td className="px-3 py-2 font-mono text-foreground">
                      {line.valid ? 1 : 0}
                    </td>
                    <td className="px-3 py-2 font-mono text-foreground">
                      {line.valid ? formatHex(line.tag ?? 0) : "----"}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {line.valid ? (
                        <span className="text-foreground">
                          Mem[{formatHex(
                            (line.blockAddress ?? 0) * blockSize
                          )}...]
                        </span>
                      ) : (
                        <span className="italic text-muted">Empty</span>
                      )}
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
