import { Effect, Schedule, TestClock, TestContext } from "effect";
import { describe, expect, it } from "vitest";

describe("retry policy", () => {
  it("retries the specified number of times with exponential backoff", async () => {
    let attempts = 0;

    const makeAttempt = Effect.sync(() => {
      attempts++;
      return attempts;
    });

    const task = makeAttempt.pipe(
      Effect.flatMap((n) =>
        n < 3 ? Effect.fail(new Error("transient failure")) : Effect.succeed("success"),
      ),
      Effect.retry(Schedule.exponential("200 millis").pipe(Schedule.intersect(Schedule.recurs(3)))),
    );

    const test = Effect.gen(function* () {
      const fiber = yield* Effect.fork(task);
      yield* TestClock.adjust("5 seconds");
      const result = yield* fiber;
      return result;
    });

    const result = await Effect.runPromise(test.pipe(Effect.provide(TestContext.TestContext)));

    expect(result).toBe("success");
    expect(attempts).toBe(3);
  });

  it("fails after exhausting retries", async () => {
    let attempts = 0;

    const makeAttempt = Effect.sync(() => {
      attempts++;
      return attempts;
    });

    const task = makeAttempt.pipe(
      Effect.flatMap(() => Effect.fail(new Error("permanent failure"))),
      Effect.retry(Schedule.exponential("200 millis").pipe(Schedule.intersect(Schedule.recurs(2)))),
    );

    const test = Effect.gen(function* () {
      const fiber = yield* Effect.fork(Effect.either(task));
      yield* TestClock.adjust("5 seconds");
      return yield* fiber;
    });

    const result = await Effect.runPromise(test.pipe(Effect.provide(TestContext.TestContext)));

    expect(result._tag).toBe("Left");
    expect(attempts).toBe(3); // 1 initial + 2 retries
  });
});

describe("ContentService", () => {
  it("returns ContentNotFoundError for unknown slug", async () => {
    const { ContentServiceLive } = await import("./content-service");
    const { ContentService } = await import("./content-service");
    const { ContentNotFoundError } = await import("./errors");

    const program = Effect.gen(function* () {
      const service = yield* ContentService;
      return yield* service.readWriteUp("nonexistent");
    }).pipe(Effect.provide(ContentServiceLive));

    const result = await Effect.runPromiseExit(program);

    expect(result._tag).toBe("Failure");
    if (result._tag === "Failure") {
      expect(result.cause._tag).toBe("Fail");
      if (result.cause._tag === "Fail") {
        expect(result.cause.error).toBeInstanceOf(ContentNotFoundError);
      }
    }
  });

  it("returns seed entry for known slug", async () => {
    const { ContentServiceLive, ContentService } = await import("./content-service");

    const program = Effect.gen(function* () {
      const service = yield* ContentService;
      return yield* service.readWriteUp("designing-an-idempotent-payment-ledger");
    }).pipe(Effect.provide(ContentServiceLive));

    const entry = await Effect.runPromise(program);

    expect(entry.slug).toBe("designing-an-idempotent-payment-ledger");
    expect(entry.title).toBe("Designing an Idempotent Payment Ledger");
  });
});
