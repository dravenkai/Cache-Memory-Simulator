"use client";

import { AddressIssue } from "@/lib/useCacheSim";
import Card from "./Card";

export default function AddressPanel({
  addresses,
  setAddresses,
  addressIssues,
  clearAddresses,
  generateRandom,
  step,
}: {
  addresses: string[];
  setAddresses: (addresses: string[]) => void;
  addressIssues: AddressIssue[];
  clearAddresses: () => void;
  generateRandom: () => void;
  step: number;
}) {
  const hasIssues = addressIssues.length > 0;

  return (
    <Card
      title="Memory Addresses"
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path strokeLinecap="round" d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      }
      action={
        <button
          onClick={clearAddresses}
          className="text-xs font-medium text-accent hover:underline"
        >
          Clear
        </button>
      }
    >
      <textarea
        value={addresses.join("\n")}
        onChange={(e) =>
          setAddresses(e.target.value.split("\n"))
        }
        rows={7}
        spellCheck={false}
        placeholder="0x0004"
        className={`w-full resize-none rounded-lg border bg-surface-2 p-3 font-mono text-sm text-foreground outline-none transition-colors focus:border-accent ${
          hasIssues ? "border-miss" : "border-border"
        }`}
      />
      {hasIssues && (
        <p className="mt-2 text-xs text-miss">
          Line {addressIssues[0].index + 1}: “{addressIssues[0].raw}” isn&apos;t a valid address
          {addressIssues.length > 1 ? ` (+${addressIssues.length - 1} more)` : ""}. Use hex
          (0x...) or decimal, within range.
        </p>
      )}
      <div className="mt-2 flex items-center justify-between text-xs text-muted">
        <span>{addresses.filter((a) => a.trim()).length} addresses</span>
        <span>
          Step {Math.min(step, addresses.length)} / {addresses.length}
        </span>
      </div>
      <button
        onClick={generateRandom}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-border/60"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
        </svg>
        Generate Random
      </button>
    </Card>
  );
}
