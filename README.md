# CacheSim

An interactive cache memory simulator built for a Computer Architecture course. It
visualizes how CPU addresses map into a cache, how hits/misses happen, and how
different mapping and eviction policies behave, step by step.

## Features

- **Mapping policies**: Direct Mapped, Fully Associative, N-Way Set Associative.
- **Replacement policies**: LRU, FIFO, Random.
- **Configurable cache**: cache size, block size, and associativity.
- **Address trace input**: type addresses in hex (`0x...`) or decimal, one per line, or
  generate a random trace.
- **Step / Run / Reset controls** to walk through a trace one access at a time or watch
  it play automatically.
- **Live Tag / Index / Offset breakdown** of the address currently being resolved.
- **Cache grid view** showing every set/way, its valid bit, tag, and cached block, with
  the most recent hit/miss highlighted.
- **Stats**: running hit count, miss count, and hit ratio.
- **Input validation**: invalid addresses and impossible cache configurations (e.g. a
  non-power-of-two size) are flagged in the UI instead of silently failing.
- A `/documentation` page explaining the underlying concepts (memory hierarchy,
  mapping strategies, replacement policies).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The simulator lives at `/simulator`,
background reading at `/documentation`.

## Project structure

```
app/
  page.tsx              landing page
  simulator/page.tsx     the simulator itself
  documentation/page.tsx background reading on cache concepts
components/               UI building blocks (config panel, cache grid, etc.)
lib/
  cache-sim.ts             pure cache simulation engine (no React)
  cache-sim.test.ts         unit tests for the engine
  useCacheSim.ts             React hook wiring the engine into UI state
```

`lib/cache-sim.ts` has no UI dependencies, so it can be tested and reasoned about on its
own — see `lib/cache-sim.test.ts`.

## Testing

```bash
npm test
```

Runs the Vitest suite covering set/way sizing math, config validation, hit/miss
behavior, and each replacement policy (LRU, FIFO, Random).

## Scripts

| Command         | Description                     |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the dev server              |
| `npm run build` | Production build                  |
| `npm run start` | Serve the production build        |
| `npm run lint`  | Lint the project                  |
| `npm test`      | Run the unit test suite (Vitest)  |

Built with [Next.js](https://nextjs.org) (App Router), React, TypeScript, and Tailwind CSS.
