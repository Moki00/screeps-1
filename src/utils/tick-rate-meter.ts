import { sum } from "lodash";

export default function updateTickRateMeter(): void {
  initMemory();

  const now: number = Date.now();
  const tickRate = now - Memory.tickRateMeter.lastTimestamp;
  Memory.tickRateMeter.lastTimestamp = now;

  updateTickRateHistory(tickRate);
}

export function getAverageTickRateInMs(): number {
  return (
    sum(Memory.tickRateMeter.tickRateHistory) /
    Memory.tickRateMeter.tickRateHistory.length
  );
}

function updateTickRateHistory(lastTickRate: number): void {
  Memory.tickRateMeter.tickRateHistory.unshift(lastTickRate);
  Memory.tickRateMeter.tickRateHistory = Memory.tickRateMeter.tickRateHistory.slice(
    0,
    TICK_RATE_HISTORY_LENGTH
  );
}

function initMemory(): void {
  if (!Memory.tickRateMeter) {
    Memory.tickRateMeter = {
      lastTimestamp: 0,
      tickRateHistory: [],
    };
  }

  if (!Memory.tickRateMeter.tickRateHistory) {
    Memory.tickRateMeter.tickRateHistory = [];
  }
}

const TICK_RATE_HISTORY_LENGTH = 100;
