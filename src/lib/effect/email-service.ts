import { Context, Effect, Layer } from "effect";
import { createTransport } from "nodemailer";
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

export const EmailServiceLocal = Layer.succeed(EmailService, {
  send: (input) =>
    Effect.gen(function* () {
      const transport = createTransport({
        host: "localhost",
        port: 1025,
        ignoreTLS: true,
      });

      yield* Effect.tryPromise({
        try: () =>
          transport.sendMail({
            from: "contact@alexmorask.dev",
            to: "alex@alexmorask.dev",
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
      }).pipe(
        Effect.tapError((error) => Effect.logError("SMTP send failed", error.cause)),
        Effect.retry(retryPolicy),
      );
    }),
});

export const EmailServiceLive = Layer.succeed(EmailService, {
  send: (input) =>
    Effect.gen(function* () {
      const resend = new Resend(process.env.RESEND_API_KEY);

      yield* Effect.tryPromise({
        try: () =>
          resend.emails.send({
            from: "contact@alexmorask.dev",
            to: "alex@alexmorask.dev",
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
      }).pipe(
        Effect.tapError((error) => Effect.logError("Resend send failed", error.cause)),
        Effect.retry(retryPolicy),
      );
    }),
});
