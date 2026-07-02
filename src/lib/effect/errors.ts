import { Data } from "effect";

export class ContentNotFoundError extends Data.TaggedError("ContentNotFoundError")<{
  readonly slug: string;
}> {}

export class EmailSendError extends Data.TaggedError("EmailSendError")<{
  readonly cause: unknown;
}> {}
