"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm({
  source = "website",
  compact = false,
  onSuccess,
}: {
  source?: string;
  compact?: boolean;
  onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      form.reset();
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-eco-200 bg-eco-50 p-6 text-center">
        <div className="text-3xl">✅</div>
        <h3 className="mt-2 text-lg font-semibold text-eco-800">Thank you!</h3>
        <p className="mt-1 text-sm text-eco-700">
          Your enquiry has been received. Our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-outline mt-4"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot — hidden from humans, catches bots */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <div className={compact ? "" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <label className="label" htmlFor="enq-name">
            Your Name *
          </label>
          <input id="enq-name" name="name" required className="field" placeholder="John Doe" />
        </div>
        <div>
          <label className="label" htmlFor="enq-phone">
            Phone Number *
          </label>
          <input
            id="enq-phone"
            name="phone"
            required
            type="tel"
            className="field"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="enq-email">
          Email
        </label>
        <input
          id="enq-email"
          name="email"
          type="email"
          className="field"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="label" htmlFor="enq-message">
          Message
        </label>
        <textarea
          id="enq-message"
          name="message"
          rows={compact ? 3 : 4}
          className="field resize-none"
          placeholder="Tell us about your requirement (roof type, monthly bill, location...)"
        />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full">
        {status === "submitting" ? "Sending..." : "Send Enquiry"}
      </button>
      <p className="text-center text-xs text-slate-400">
        We respect your privacy. Your details are only used to respond to your enquiry.
      </p>
    </form>
  );
}
