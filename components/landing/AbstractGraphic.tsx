export default function AbstractGraphic() {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-border bg-[radial-gradient(ellipse_at_center,var(--surface-2),var(--background))]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute h-28 w-28 rotate-45 rounded-xl border border-accent/40 bg-accent/5" />
          <div className="absolute h-20 w-20 rotate-45 rounded-lg border border-accent-2/50 bg-accent/10" />
          <div className="absolute h-12 w-12 rotate-45 rounded-md bg-accent/30 blur-[1px]" />
          <div className="absolute h-4 w-4 rounded-full bg-accent shadow-[0_0_24px_6px_var(--accent)]" />
        </div>
      </div>
    </div>
  );
}
