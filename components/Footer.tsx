export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
        <p className="text-sm font-semibold tracking-widest text-muted">CACHESIM</p>
        <p className="mt-1 text-xs text-muted">© 2026 University Architecture Lab</p>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted">
          <a href="#" className="hover:text-foreground transition-colors">
            Team Members
          </a>
          <a href="/documentation" className="hover:text-foreground transition-colors">
            Documentation
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
