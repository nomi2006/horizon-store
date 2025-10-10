import React from "react";
import { Mail } from "lucide-react";
import { Section } from "./Section";

export function Newsletter() {
  return (
    <Section
      id="newsletter"
      eyebrow="Stay in the loop"
      title="Subscribe to our newsletter"
      description="Be first to know about product drops and member‑only offers."
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mx-auto flex max-w-xl flex-col items-center gap-3 sm:flex-row"
      >
        <input
          type="email"
          required
          placeholder="you@example.com"
          className="w-full flex-1 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        />
        <button className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-medium text-white">
          <Mail className="h-4 w-4" /> Subscribe
        </button>
      </form>
      <p className="mt-3 text-center text-xs text-gray-500">
        We respect your inbox. Unsubscribe anytime.
      </p>
    </Section>
  );
}
