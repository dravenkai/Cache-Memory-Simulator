"use client";

import { AccessResult, formatHex } from "@/lib/cache-sim";
import Card from "./Card";

function toBinary(value: number, bits: number): string {
  if (bits <= 0) return "";
  return value.toString(2).padStart(bits, "0");
}

function Field({
  label,
  bits,
  value,
  colorVar,
}: {
  label: string;
  bits: number;
  value: number;
  colorVar: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <span className="text-xs font-medium text-muted">
        {label} <span className="text-muted/70">({bits} bit{bits === 1 ? "" : "s"})</span>
      </span>
      <div
        className="flex w-full items-center justify-center rounded-lg border px-3 py-2.5 font-mono text-sm"
        style={{ borderColor: `var(${colorVar})`, background: `color-mix(in srgb, var(${colorVar}) 12%, transparent)` }}
      >
        {bits > 0 ? toBinary(value, bits) : "—"}
      </div>
      <span className="font-mono text-xs text-muted">{bits > 0 ? formatHex(value, Math.ceil(bits / 4)) : "n/a"}</span>
    </div>
  );
}

export default function AddressBreakdown({ result }: { result: AccessResult | null }) {
  return (
    <Card
      title="Address Breakdown"
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
          <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      }
    >
      {result ? (
        <div className="flex flex-col gap-4">
          <div className="text-center font-mono text-sm text-muted">
            {formatHex(result.address)} <span className="text-muted/60">=</span>{" "}
            <span className="text-foreground">
              {toBinary(result.address, result.tagBits) || "—"}
            </span>
            <span className="text-accent"> {toBinary(result.setIndex, result.indexBits) || ""}</span>
            <span className="text-hit"> {toBinary(result.offset, result.offsetBits)}</span>
          </div>
          <div className="flex gap-3">
            <Field label="Tag" bits={result.tagBits} value={result.tag} colorVar="--foreground" />
            <Field label="Index (Set)" bits={result.indexBits} value={result.setIndex} colorVar="--accent" />
            <Field label="Offset" bits={result.offsetBits} value={result.offset} colorVar="--hit" />
          </div>
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-muted">
          Step through the trace to see how an address splits into Tag / Index / Offset.
        </p>
      )}
    </Card>
  );
}
