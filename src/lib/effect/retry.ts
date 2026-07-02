import { Schedule } from "effect";

/**
 * Exponential backoff: 200ms, 400ms, 800ms — max 3 retries (4 total attempts).
 * Used for both CMS reads and email sends.
 */
export const retryPolicy = Schedule.exponential("200 millis").pipe(
  Schedule.intersect(Schedule.recurs(3)),
);
