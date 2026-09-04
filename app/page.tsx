import Link from "next/link";
import AbstractGraphic from "@/components/landing/AbstractGraphic";
import Badge from "@/components/landing/Badge";
import FeatureCard from "@/components/landing/FeatureCard";
import LivePreviewCard from "@/components/landing/LivePreviewCard";

const AVATAR_CLASSES = [
  "h-7 w-7 rounded-full border-2 border-surface bg-accent",
  "h-7 w-7 rounded-full border-2 border-surface bg-hit",
  "h-7 w-7 rounded-full border-2 border-surface bg-miss",
  "h-7 w-7 rounded-full border-2 border-surface bg-emerald-500",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center">
      <section className="flex w-full max-w-2xl flex-col items-center px-4 py-16 text-center sm:px-6">
        {/* <Badge
          icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6L12 17.2l-6.2 4.5 2.4-7.6L2 9.6h7.6z" />
            </svg>
          }
        >
          Academic Tooling v2.0
        </Badge> */}

        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Master Cache
          <br />
          <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
            Memory Logic
          </span>
        </h1>

        <p className="mt-5 max-w-lg text-sm leading-6 text-muted sm:text-base">
          Bridge the gap between computer architecture theory and hardware
          implementation. A high-fidelity visualization engine designed for
          computer science students and researchers.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/simulator"
            className="flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-2"
          >
            Start Simulation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link
            href="/documentation"
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-border/60"
          >
            View Documentation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
            </svg>
          </Link>
        </div>

        <div className="mt-12 flex w-full justify-center">
          <LivePreviewCard />
        </div>
      </section>

      {/* <section className="w-full max-w-2xl px-4 py-14 text-center sm:px-6">
        <Badge>Academic Tooling v2.0</Badge>
        <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
          Professional Grade
          <br />
          Architecture Education
        </h2>
        <p className="mt-5 text-sm leading-7 text-muted">
          Developed at the University Architecture Lab, CacheSim provides an
          intuitive yet rigorous environment for exploring how CPUs manage
          high-speed memory. Unlike static diagrams, our simulator executes
          actual memory traces in real-time.
        </p>
        <p className="mt-4 text-sm leading-7 text-muted">
          Students can deconstruct memory addresses into Tag, Index, and Offset
          components, observing exactly how mapping policies like Direct
          Mapping, Set-Associative, and Fully Associative impact performance
          and hit rates.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {AVATAR_CLASSES.map((className, i) => (
              <span key={i} className={className} />
            ))}
          </div>
          <span className="text-xs text-muted">Used by students globally</span>
        </div>

        <div className="mt-10">
          <AbstractGraphic />
        </div>
      </section> */}

      <section className="w-full max-w-5xl px-4 py-14 text-center sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Powerful Visual Logic
        </h2>
        <p className="mt-2 text-sm text-muted">
          Everything you need to visualize, analyze, and master cache hierarchy
          concepts.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
          <FeatureCard
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 3l-4 4 4 4M16 21l4-4-4-4" />
                <path strokeLinecap="round" d="M4 7h9a4 4 0 0 1 4 4v0M20 17H11a4 4 0 0 1-4-4v0" />
              </svg>
            }
            title="Multiple Mapping Policies"
            description="Switch between Direct Mapped, N-Way Set Associative, and Fully Associative configurations with a single click."
          />
          <FeatureCard
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
            title="Real-time Visualization"
            description="Watch memory addresses resolve through tags and indices as the simulator steps through your data trace."
          />
          <FeatureCard
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path strokeLinecap="round" d="M8 16v-4M12 16V8M16 16v-7" />
              </svg>
            }
            title="Performance Analytics"
            description="Comprehensive statistics on hit rates, miss penalties, and eviction frequency (LRU, FIFO, Random)."
          />
        </div>
      </section>

      <section className="w-full max-w-2xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Ready to start simulate?
        </h2>
        <p className="mt-3 text-sm text-muted">
          Join thousands of students and educators using CacheSim to simplify
          computer architecture.
        </p>
        <div className="mt-6">
          <Link
            href="/simulator"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-2"
          >
            Launch Simulator Now
          </Link>
        </div>
      </section>
    </div>
  );
}
