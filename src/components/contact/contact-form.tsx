"use client";

import { useActionState } from "react";
import { type ContactFormState, submitContactForm } from "@/app/contact/actions";

const initialState: ContactFormState | null = null;

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-[22px] rounded-[10px] border border-white/10 bg-card p-6 lg:p-9"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 pointer-events-none"
        style={{ left: "-9999px", position: "absolute" }}
      />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground"
          >
            NAME
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Jane Doe"
            className="rounded-md border border-input bg-background px-3.5 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground"
          >
            EMAIL
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="jane@company.com"
            className="rounded-md border border-input bg-background px-3.5 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="company"
          className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground"
        >
          COMPANY <span className="text-text-faint">(OPTIONAL)</span>
        </label>
        <input
          type="text"
          id="company"
          name="company"
          placeholder="Acme Inc."
          className="rounded-md border border-input bg-background px-3.5 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground"
        >
          MESSAGE
        </label>
        <textarea
          id="message"
          name="message"
          required
          placeholder="What's on your mind?"
          rows={6}
          className="resize-y rounded-md border border-input bg-background px-3.5 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
        />
      </div>

      {state?.success && (
        <p className="font-sans text-sm text-accent-green">
          Message sent — I'll get back to you soon.
        </p>
      )}
      {state?.error && <p className="font-sans text-sm text-destructive">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-primary px-[22px] py-3.5 font-sans text-sm font-semibold text-primary-foreground transition-all cursor-pointer hover:brightness-110 hover:-translate-y-px disabled:opacity-50"
      >
        {isPending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
