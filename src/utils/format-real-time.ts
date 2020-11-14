import { trim } from "lodash";

export default function formatRealTime(timeInSeconds: number): string {
  timeInSeconds = Math.round(timeInSeconds);
  const days = Math.floor(timeInSeconds / SECONDS_IN_DAY);
  const hours = Math.floor((timeInSeconds / SECONDS_IN_HOUR) % HOURS_IN_DAY);
  const minutes = Math.floor(
    (timeInSeconds / SECONDS_IN_MINUTE) % MINUTES_IN_HOUR
  );
  const seconds = timeInSeconds % SECONDS_IN_MINUTE;
  let formatted = "";
  formatted += days ? `${days}d ` : "";
  formatted += hours ? `${hours}h ` : "";
  formatted += minutes ? `${minutes}m ` : "";
  formatted += seconds ? `${seconds}s ` : "";
  return trim(formatted);
}

const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
const SECONDS_IN_DAY = SECONDS_IN_HOUR * HOURS_IN_DAY;
