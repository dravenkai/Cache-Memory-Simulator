"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AccessResult,
  CacheConfig,
  CacheState,
  DEFAULT_CONFIG,
  MAX_ADDRESS,
  accessCache,
  createCache,
  generateAddressTrace,
  parseAddress,
  validateConfig,
} from "./cache-sim";

const DEFAULT_ADDRESSES = ["0x0004", "0x0008", "0x0010", "0x0004", "0x01F4", "0x0020"];

export interface AddressIssue {
  index: number;
  raw: string;
  reason: string;
}

export function useCacheSim() {
  const [config, setConfigState] = useState<CacheConfig>(DEFAULT_CONFIG);
  const [addresses, setAddresses] = useState<string[]>(DEFAULT_ADDRESSES);
  const [cache, setCache] = useState<CacheState>(() => createCache(DEFAULT_CONFIG));
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState<AccessResult[]>([]);
  const [running, setRunning] = useState(false);
  const [lastSkipped, setLastSkipped] = useState<{ index: number; raw: string } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const configError = useMemo(() => validateConfig(config), [config]);

  // Every address that fails to parse, keyed by its index in `addresses`,
  // so the UI can flag bad lines before the user even hits Step/Run.
  const addressIssues = useMemo<AddressIssue[]>(() => {
    return addresses.reduce<AddressIssue[]>((issues, raw, index) => {
      if (!raw.trim()) return issues;
      if (parseAddress(raw) === null) {
        issues.push({
          index,
          raw,
          reason: `Not a valid address (expected 0x0 - ${"0x" + MAX_ADDRESS.toString(16).toUpperCase()}, or a decimal number).`,
        });
      }
      return issues;
    }, []);
  }, [addresses]);

  const reset = useCallback(() => {
    if (!validateConfig(config)) {
      setCache(createCache(config));
    }
    setStep(0);
    setHistory([]);
    setRunning(false);
    setLastSkipped(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [config]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const setConfig = useCallback((updater: (prev: CacheConfig) => CacheConfig) => {
    setConfigState(updater);
  }, []);

  const updateAddresses = useCallback(
    (nextAddresses: string[]) => {
      setAddresses(nextAddresses);
      reset();
    },
    [reset]
  );

  const stopRun = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  }, []);

  const doStep = useCallback(() => {
    if (step >= addresses.length || configError) return;
    const raw = addresses[step];
    const parsed = parseAddress(raw);
    if (parsed !== null) {
      setLastSkipped(null);
      const { state, result } = accessCache(cache, config, parsed);
      setCache(state);
      setHistory((h) => [...h, result]);
    } else if (raw.trim()) {
      // Invalid address: surface it instead of silently swallowing the step.
      setLastSkipped({ index: step, raw });
    }
    const nextStep = step + 1;
    setStep(nextStep);
    if (running && nextStep >= addresses.length) {
      stopRun();
    }
  }, [step, addresses, config, cache, configError, running, stopRun]);

  const doStepRef = useRef(doStep);
  useEffect(() => {
    doStepRef.current = doStep;
  }, [doStep]);

  const run = useCallback(() => {
    if (running || configError) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      doStepRef.current();
    }, 700);
  }, [running, configError]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const clearAddresses = useCallback(() => {
    updateAddresses([]);
  }, [updateAddresses]);

  const generateRandom = useCallback(() => {
    updateAddresses(generateAddressTrace(config, 8));
  }, [config, updateAddresses]);

  const totalHits = history.filter((h) => h.hit).length;
  const totalMisses = history.filter((h) => !h.hit).length;
  const hitRatio = history.length > 0 ? (totalHits / history.length) * 100 : 0;

  const lastResult = history.length > 0 ? history[history.length - 1] : null;

  return {
    config,
    setConfig,
    configError,
    addresses,
    setAddresses: updateAddresses,
    addressIssues,
    clearAddresses,
    generateRandom,
    cache,
    step,
    history,
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
  };
}
