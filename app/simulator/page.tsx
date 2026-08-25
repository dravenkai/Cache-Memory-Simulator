"use client";

import AddressBreakdown from "@/components/AddressBreakdown";
import AddressPanel from "@/components/AddressPanel";
import CacheGrid from "@/components/CacheGrid";
import ConfigPanel from "@/components/ConfigPanel";
import ControlsPanel from "@/components/ControlsPanel";
import StatsCards from "@/components/StatsCards";
import { useCacheSim } from "@/lib/useCacheSim";

export default function Home() {
  const {
    config,
    setConfig,
    configError,
    addresses,
    setAddresses,
    addressIssues,
    clearAddresses,
    generateRandom,
    cache,
    step,
    lastResult,
    lastSkipped,
    running,
    doStep,
    run,
    stopRun,
    reset,
    totalHits,
    totalMisses,
    hitRatio,
  } = useCacheSim();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ConfigPanel config={config} setConfig={setConfig} />
        <AddressPanel
          addresses={addresses}
          setAddresses={setAddresses}
          addressIssues={addressIssues}
          clearAddresses={clearAddresses}
          generateRandom={generateRandom}
          step={step}
        />
      </div>

      <ControlsPanel
        running={running}
        step={step}
        total={addresses.filter((a) => a.trim()).length}
        configError={configError}
        lastSkipped={lastSkipped}
        onReset={reset}
        onStep={doStep}
        onRun={run}
        onStop={stopRun}
      />

      <AddressBreakdown result={lastResult} />

      <CacheGrid cache={cache} blockSize={config.blockSize} lastResult={lastResult} />

      <StatsCards totalHits={totalHits} totalMisses={totalMisses} hitRatio={hitRatio} />
    </div>
  );
}
