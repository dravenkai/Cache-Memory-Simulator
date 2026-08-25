export default function StatsCards({
  totalHits,
  totalMisses,
  hitRatio,
}: {
  totalHits: number;
  totalMisses: number;
  hitRatio: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-sm">
        <p className="text-xs font-medium text-muted">Total Hits</p>
        <p className="mt-2 text-3xl font-semibold text-hit">{totalHits}</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-sm">
        <p className="text-xs font-medium text-muted">Total Misses</p>
        <p className="mt-2 text-3xl font-semibold text-miss">{totalMisses}</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-sm">
        <p className="text-xs font-medium text-muted">Hit Ratio</p>
        <p className="mt-2 text-3xl font-semibold text-foreground">
          {hitRatio.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
