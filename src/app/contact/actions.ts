"use server";

import { Effect, Layer, Logger } from "effect";
import type { EmailInput } from "@/lib/effect/email-service";
import { EmailService } from "@/lib/effect/email-service";
import { EmailSendError } from "@/lib/effect/errors";
import { MainLive } from "@/lib/effect/runtime";

export interface ContactFormState {
  readonly success: boolean;
  readonly error?: string;
}

export async function submitContactForm(
  _prevState: ContactFormState | null,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const company = formData.get("company") ? String(formData.get("company")) : undefined;
  const message = String(formData.get("message") ?? "");

  if (!name || !email || !message) {
    return { success: false, error: "Name, email, and message are required." };
  }

  if (formData.get("website")) {
    return { success: true };
  }

  const input: EmailInput = { name, email, message };
  if (company) {
    input.company = company;
  }

  const program = Effect.gen(function* () {
    const emailService = yield* EmailService;
    yield* emailService.send(input);
  }).pipe(
    Effect.annotateLogs({ email: input.email, name: input.name }),
    Effect.provide(MainLive),
    Effect.provide(Logger.json),
  );

  const result = await Effect.runPromiseExit(program);

  if (result._tag === "Success") {
    return { success: true };
  }

  const cause = result.cause;
  if (cause._tag === "Fail" && cause.error instanceof EmailSendError) {
    return { success: false, error: "Failed to send message. Please try again." };
  }

  return { success: false, error: "An unexpected error occurred." };
}
