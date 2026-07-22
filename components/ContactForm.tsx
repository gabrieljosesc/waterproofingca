"use client";

import { useState } from "react";
import { services } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Something went wrong.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or call us."
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="form">
        <h3 style={{ fontSize: "1.4rem", marginBottom: 10 }}>
          Request received!
        </h3>
        <p style={{ color: "var(--text-muted)" }}>
          Thanks for reaching out. Our team will review your request and get
          back to you within one business day — or much sooner if it&apos;s an
          emergency. If water is actively coming in, call our 24/7 line for
          immediate dispatch.
        </p>
        <button
          className="btn btn--ghost"
          style={{ marginTop: 22 }}
          onClick={() => setStatus("idle")}
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {status === "error" && error && <div className="form__error">{error}</div>}

      <div className="form__row">
        <div className="field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Smith"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(905) 555-0000"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="service">Service Needed</label>
          <select id="service" name="service" defaultValue="" required>
            <option value="" disabled>
              Select a service…
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
            <option value="other">Not sure / Other</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="property_type">Property Type</label>
          <select id="property_type" name="property_type" defaultValue="residential">
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="message">Tell Us About the Problem</label>
        <textarea
          id="message"
          name="message"
          placeholder="Where is the water coming in? How long has it been happening? Include your city and any timeline…"
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn--primary"
        style={{ width: "100%" }}
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Request Free Quote"}
      </button>
      <p className="form__note">
        Free, no-obligation quotes for residential &amp; commercial properties.
        For active flooding, call our 24/7 emergency line instead — it&apos;s
        faster.
      </p>
    </form>
  );
}
