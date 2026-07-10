import { Data } from "effect";

export class ContentNotFoundError extends Data.TaggedError("ContentNotFoundError")<{
  readonly slug: string;
}> {}

export class ContentReadError extends Data.TaggedError("ContentReadError")<{
  readonly slug: string;
  readonly cause: unknown;
}> {}

export class EmailSendError extends Data.TaggedError("EmailSendError")<{
  readonly cause: unknown;
}> {}
