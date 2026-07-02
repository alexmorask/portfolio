import { Context, Effect, Layer } from "effect";
import { Resend } from "resend";
import { EmailSendError } from "./errors";
import { retryPolicy } from "./retry";

export interface EmailInput {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export class EmailService extends Context.Tag("EmailService")<
  EmailService,
  {
    readonly send: (input: EmailInput) => Effect.Effect<void, EmailSendError>;
  }
>() {}

export const EmailServiceLive = Layer.succeed(EmailService, {
  send: (input) =>
    Effect.gen(function* () {
      const resend = new Resend(process.env.RESEND_API_KEY);

      yield* Effect.tryPromise({
        try: () =>
          resend.emails.send({
            from: "contact@alexmorask.com",
            to: "alex@alexmorask.com",
            replyTo: input.email,
            subject: `Portfolio contact: ${input.name}`,
            html: `
              <p><strong>Name:</strong> ${input.name}</p>
              <p><strong>Email:</strong> ${input.email}</p>
              ${input.company ? `<p><strong>Company:</strong> ${input.company}</p>` : ""}
              <p><strong>Message:</strong></p>
              <p>${input.message}</p>
            `,
          }),
        catch: (error) => new EmailSendError({ cause: error }),
      }).pipe(Effect.retry(retryPolicy));
    }),
});
