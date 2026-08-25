"use client";

export default function ControlsPanel({
  running,
  step,
  total,
  configError,
  lastSkipped,
  onReset,
  onStep,
  onRun,
  onStop,
}: {
  running: boolean;
  step: number;
  total: number;
  configError?: string | null;
  lastSkipped?: { index: number; raw: string } | null;
  onReset: () => void;
  onStep: () => void;
  onRun: () => void;
  onStop: () => void;
}) {
  const finished = step >= total && total > 0;
  const disabled = finished || !!configError;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                configError
                  ? "bg-miss"
                  : running
                  ? "bg-hit animate-pulse"
                  : finished
                  ? "bg-emerald-400"
                  : "bg-muted"
              }`}
            />
            <span className="text-muted">
              {configError ? "Invalid config" : running ? "Running" : finished ? "Finished" : "Idle"}
            </span>
          </span>
          <span className="text-border">|</span>
          <span className="text-muted">
            Current Step: <span className="font-medium text-foreground">{Math.min(step, total)}</span> /{" "}
            {total}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-border/60"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 1 3 6.7M3 12v6h6" />
            </svg>
            Reset
          </button>
          <button
            onClick={onStep}
            disabled={running || disabled}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-border/60 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            Step
          </button>
          <button
            onClick={running ? onStop : onRun}
            disabled={disabled}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {running ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Run
              </>
            )}
          </button>
        </div>
      </div>

      {configError && (
        <p className="mt-3 rounded-lg bg-miss/10 px-3 py-2 text-xs text-miss">
          Configuration error: {configError}
        </p>
      )}
      {!configError && lastSkipped && (
        <p className="mt-3 rounded-lg bg-miss/10 px-3 py-2 text-xs text-miss">
          Step {lastSkipped.index + 1} skipped — “{lastSkipped.raw}” isn&apos;t a valid address.
        </p>
      )}
    </section>
  );
}
