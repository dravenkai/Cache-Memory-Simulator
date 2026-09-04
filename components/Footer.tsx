export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
        <p className="text-sm font-semibold tracking-widest text-muted">L1 CacheSimulator</p>
        <p className="mt-1 text-xs text-muted">© 2026 Lu Chaw Gyi Myar</p>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted">
          <a href="#" className="hover:text-foreground transition-colors">
            Home
          </a>
          <a href="/documentation" className="hover:text-foreground transition-colors">
            Documentation
          </a>
          <a href="/simulator" className="hover:text-foreground transition-colors">
            Simulator
          </a>
        </div>
      </div>
    </footer>
  );
}
