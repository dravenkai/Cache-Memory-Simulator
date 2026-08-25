const TRACE = [
  { addr: "0x7FFF", hit: true },
  { addr: "0x1234", hit: false },
  { addr: "0x7FFF", hit: true },
  { addr: "0xABBC", hit: true },
];

// deterministic pseudo-random fill pattern so SSR/client markup match
const GRID_PATTERN = [
  1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0,
  1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0,
];

export default function LivePreviewCard() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-miss/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          LIVE CACHE STATUS: ACTIVE
        </span>
      </div>

      <div className="mt-4 grid grid-cols-8 gap-1.5">
        {GRID_PATTERN.map((filled, i) => (
          <div
            key={i}
            className={`aspect-square rounded-sm ${
              filled ? "bg-accent/70" : "bg-surface-2"
            }`}
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-y border-border py-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-hit">87.4%</p>
          <p className="mt-1 text-[11px] font-medium tracking-wide text-muted">
            HIT RATIO
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-foreground">1,248</p>
          <p className="mt-1 text-[11px] font-medium tracking-wide text-muted">
            TOTAL ADDRESSES
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <p className="mb-1 text-[11px] font-medium tracking-wide text-muted">
          ADDRESS TRACE
        </p>
        {TRACE.map((t, i) => (
          <div
            key={i}
            className="flex items-center justify-between font-mono text-xs text-foreground"
          >
            <span>{t.addr}</span>
            <span className={t.hit ? "text-hit" : "text-miss"}>
              {t.hit ? "Hit" : "Miss"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
