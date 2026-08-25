import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Understanding Cache Memory — CacheSim",
};

const mappingStrategies = [
  {
    name: "Direct Mapping",
    color: "hit",
    description:
      "Each block of main memory maps to exactly one possible cache location. It's the simplest strategy but can lead to \"thrashing\" if two frequently used blocks map to the same line.",
    tags: ["Fast Search", "High Conflict"],
    bars: [90, 15],
  },
  {
    name: "Fully Associative",
    color: "accent",
    description:
      "A block of main memory can be placed in any cache line. This eliminates mapping conflicts but requires searching the entire cache (or complex hardware) to find a block.",
    tags: ["Zero Conflicts", "Expensive Hardware"],
    bars: [20, 20, 20, 20, 20, 20],
  },
  {
    name: "Set Associative",
    color: "miss",
    description:
      "The middle ground. Cache is divided into sets, and each block maps to a specific set but can be placed in any line within that set (e.g., a 4-way set associative).",
    tags: ["Balanced Perf", "Modern Standard"],
    bars: [70, 40],
  },
];

const replacementPolicies = [
  {
    name: "LRU (Least Recently Used)",
    description:
      "Discards the items that have not been used for the longest period of time. This policy requires keeping track of when each item was last accessed.",
  },
  {
    name: "FIFO (First-In, First-Out)",
    description:
      "The simplest algorithm. The cache evicts the block that was loaded earliest, regardless of how often it has been accessed in the meantime.",
  },
  {
    name: "Random",
    description:
      "Evicts a uniformly random line from the set when it's full. Cheap to implement in hardware and surprisingly competitive with LRU in practice, since it avoids LRU's worst-case access patterns.",
  },
];

const objectives = [
  {
    name: "Interactive Visualization",
    description:
      "Provide a real-time, animated view of memory blocks moving from RAM to Cache based on different configurations.",
  },
  {
    name: "Statistical Comparison",
    description:
      "Track Hit/Miss ratios across various cache sizes and mapping strategies to understand performance trade-offs.",
  },
  {
    name: "Educational Tooling",
    description:
      "Created for the University Architecture Lab to assist students in mastering Low-Level system concepts.",
  },
];

export default function DocumentationPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-14 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-accent">
        Architectural Foundation
      </p>
      <h1 className="mt-3 text-center text-4xl font-bold tracking-tight sm:text-5xl">
        Understanding
        <br />
        Cache Memory
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-6 text-muted">
        CacheSim is a high-fidelity visual simulator designed to demystify the complex
        mapping and replacement strategies used in modern CPU architectures.
      </p>

      <section className="mt-16">
        <h2 className="border-l-2 border-accent pl-3 text-lg font-semibold">
          What is Cache Memory?
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted">
          Cache memory is a small, high-speed buffer located between the CPU and the main
          RAM. It stores frequently used instructions and data to reduce the time it takes
          to access information from main memory.
        </p>
        <p className="mt-4 text-sm leading-7 text-muted">
          In a typical hierarchy, the L1, L2, and L3 caches provide a tiered approach to
          data retrieval, leveraging{" "}
          <span className="font-medium text-foreground">Temporal Locality</span> (recently
          accessed data is likely to be accessed again) and{" "}
          <span className="font-medium text-foreground">Spatial Locality</span> (nearby
          data is likely to be accessed soon).
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-8">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <HierarchyBox label="CPU" />
            <Arrow />
            <HierarchyBox label="L1" small />
            <HierarchyBox label="L2" small />
            <HierarchyBox label="L3" small />
            <Arrow />
            <HierarchyBox label="RAM" wide />
          </div>
          <p className="mt-5 text-center text-xs italic text-muted">
            Typical Memory Hierarchy: Speed vs Size Bottlenecks
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-center text-2xl font-bold tracking-tight">
          Mapping Strategies
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          How data addresses are assigned to cache lines
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {mappingStrategies.map((strategy) => (
            <div
              key={strategy.name}
              className="rounded-2xl border border-border bg-surface p-6"
              style={{ borderLeft: `3px solid var(--${strategy.color})` }}
            >
              <h3 className="text-base font-semibold">{strategy.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{strategy.description}</p>
              <div className="mt-4 flex gap-2">
                {strategy.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-1.5">
                {strategy.bars.map((w, i) => (
                  <div key={i} className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${w}%`,
                        background: `var(--${strategy.color})`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-center text-2xl font-bold tracking-tight">
          Replacement Policies
        </h2>

        <div className="mt-8 flex flex-col gap-4">
          {replacementPolicies.map((policy) => (
            <div
              key={policy.name}
              className="flex gap-4 rounded-2xl border border-border bg-surface p-6"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                </svg>
              </span>
              <div>
                <h3 className="text-base font-semibold">{policy.name}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{policy.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-surface p-8">
        <h2 className="text-center text-2xl font-bold tracking-tight">
          Project Objectives
        </h2>
        <div className="mt-8 flex flex-col gap-6">
          {objectives.map((obj, i) => (
            <div key={obj.name} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <ObjectiveIcon index={i} />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{obj.name}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{obj.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function HierarchyBox({
  label,
  small,
  wide,
}: {
  label: string;
  small?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-accent/40 bg-accent/10 text-xs font-semibold text-accent ${
        wide ? "h-16 w-16" : small ? "h-10 w-10" : "h-16 w-14"
      }`}
    >
      {label}
    </div>
  );
}

function Arrow() {
  return (
    <svg width="20" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
      <path strokeLinecap="round" strokeLinejoin="round" d="M0 6h20M15 1l5 5-5 5" />
    </svg>
  );
}

function ObjectiveIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path strokeLinecap="round" d="M8 16v-4M12 16V8M16 16v-7" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2 2 7l10 5 10-5-10-5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}
