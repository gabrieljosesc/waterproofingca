import "server-only";
import { site } from "@/lib/site";

/**
 * Email templates. Simple table-free HTML with inline styles (email clients
 * ignore stylesheets), navy/steel-blue to match the site, always with a
 * plain-text twin.
 */

const wrap = (title: string, bodyHtml: string) => `<!doctype html>
<html><body style="margin:0;padding:0;background:#f2f5f9;font-family:Arial,Helvetica,sans-serif;color:#1c2b3a;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;">
  <div style="background:#0a111e;border-radius:10px 10px 0 0;padding:18px 24px;">
    <span style="color:#eaf2f8;font-size:18px;font-weight:bold;">${site.name}</span>
    <span style="color:#6ea8cd;font-size:12px;letter-spacing:2px;display:block;margin-top:2px;">SOUTHERN ONTARIO · 24/7</span>
  </div>
  <div style="background:#ffffff;border:1px solid #dce4ec;border-top:none;border-radius:0 0 10px 10px;padding:24px;">
    <h1 style="font-size:20px;margin:0 0 16px;">${title}</h1>
    ${bodyHtml}
  </div>
  <p style="font-size:11px;color:#8395a7;text-align:center;margin-top:16px;">
    ${site.name} · ${site.address} · ${site.phone}
  </p>
</div>
</body></html>`;

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-CA");

// ---------------------------------------------------------------- owner alert

export interface OwnerAlertInput {
  kind: "estimate" | "contact";
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  service?: string | null;
  urgent?: boolean;
  activeLeak?: boolean;
  message?: string | null;
  dashboardUrl?: string;
}

export function ownerAlertEmail(input: OwnerAlertInput): {
  subject: string;
  html: string;
  text: string;
} {
  const flags = [
    input.urgent ? "URGENT" : null,
    input.activeLeak ? "ACTIVE LEAK" : null,
  ].filter(Boolean);

  const subject =
    (flags.length ? `[${flags.join(", ")}] ` : "") +
    (input.kind === "estimate"
      ? `New estimate request — ${input.name}${input.city ? `, ${input.city}` : ""}`
      : `New contact-form lead — ${input.name}`);

  const rows: Array<[string, string]> = [
    ["Name", input.name],
    ["Email", input.email],
    ...(input.phone ? ([["Phone", input.phone]] as Array<[string, string]>) : []),
    ...(input.city ? ([["City", input.city]] as Array<[string, string]>) : []),
    ...(input.service ? ([["Service", input.service]] as Array<[string, string]>) : []),
  ];

  const html = wrap(
    subject,
    `
    ${flags.length ? `<p style="color:#b42318;font-weight:bold;">⚠ ${flags.join(" · ")}</p>` : ""}
    ${rows
      .map(
        ([k, v]) =>
          `<p style="margin:4px 0;"><span style="color:#8395a7;">${k}:</span> <strong>${v}</strong></p>`
      )
      .join("")}
    ${input.message ? `<p style="margin:12px 0;padding:12px;background:#f2f5f9;border-radius:8px;">${input.message}</p>` : ""}
    ${
      input.dashboardUrl
        ? `<p style="margin-top:20px;"><a href="${input.dashboardUrl}" style="background:#3a6d8f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold;display:inline-block;">Review in dashboard</a></p>`
        : ""
    }`
  );

  const text = [
    subject,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    input.message ? `\n${input.message}` : "",
    input.dashboardUrl ? `\nReview: ${input.dashboardUrl}` : "",
  ].join("\n");

  return { subject, html, text };
}

// -------------------------------------------------------- quote acceptance

export interface QuoteAcceptedInput {
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  service?: string | null;
  rangeLow: number;
  rangeHigh: number;
  depositPercent: number;
  depositLow: number;
  depositHigh: number;
  cardBrand?: string;
  cardLast4?: string;
  dashboardUrl?: string;
}

/**
 * Owner alert when a customer accepts their instant estimate and submits
 * card details for the refundable deposit. Full PAN is never emailed —
 * open the dashboard to reveal it, charge the terminal, then mark collected.
 */
export function quoteAcceptedEmail(input: QuoteAcceptedInput): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `🔒 Quote accepted — deposit card on file — ${input.name}${
    input.city ? `, ${input.city}` : ""
  }`;

  const cardLine =
    input.cardLast4
      ? `${(input.cardBrand ?? "card").toString()} •••• ${input.cardLast4}`
      : null;

  const rows: Array<[string, string]> = [
    ["Name", input.name],
    ["Email", input.email],
    ...(input.phone ? ([["Phone", input.phone]] as Array<[string, string]>) : []),
    ...(input.city ? ([["City", input.city]] as Array<[string, string]>) : []),
    ...(input.service ? ([["Service", input.service]] as Array<[string, string]>) : []),
    ["Estimate range", `${money(input.rangeLow)} – ${money(input.rangeHigh)}`],
    ...(cardLine ? ([["Card on file", cardLine]] as Array<[string, string]>) : []),
  ];

  const html = wrap(
    subject,
    `
    <p style="color:#0a7a3d;font-weight:bold;">This customer accepted their instant estimate and locked in a priority slot with a refundable deposit card.</p>
    ${rows
      .map(
        ([k, v]) =>
          `<p style="margin:4px 0;"><span style="color:#8395a7;">${k}:</span> <strong>${v}</strong></p>`
      )
      .join("")}
    <div style="background:#f2f5f9;border-radius:10px;padding:16px 20px;margin:16px 0;text-align:center;">
      <p style="margin:0;color:#8395a7;font-size:12px;letter-spacing:1px;">DEPOSIT DUE (${input.depositPercent}%)</p>
      <p style="margin:6px 0 0;font-size:22px;font-weight:bold;color:#3a6d8f;">${money(input.depositLow)} – ${money(input.depositHigh)}</p>
    </div>
    <p style="font-size:13px;color:#5b6b7b;">Open the dashboard to view the full card details (admin only), charge the refundable deposit on your terminal, then mark it collected — that clears the full number from storage.</p>
    ${
      input.dashboardUrl
        ? `<p style="margin-top:20px;"><a href="${input.dashboardUrl}" style="background:#3a6d8f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold;display:inline-block;">Open in dashboard</a></p>`
        : ""
    }`
  );

  const text = [
    subject,
    "",
    "This customer accepted their instant estimate and locked in a priority slot with a refundable deposit card.",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    `Deposit due (${input.depositPercent}%): ${money(input.depositLow)} – ${money(input.depositHigh)}`,
    "",
    "Open the dashboard to view the full card details (admin only), charge your terminal, then mark the deposit collected.",
    input.dashboardUrl ? `\nOpen: ${input.dashboardUrl}` : "",
  ].join("\n");

  return { subject, html, text };
}

// ---------------------------------------------------------- customer estimate

export interface CustomerEstimateInput {
  name: string;
  service: string | null;
  linearFeet: number | null;
  finalLow: number;
  finalHigh: number;
  rebateAmount: number;
  rebateCity: string | null;
  validDays: number;
}

export function customerEstimateEmail(input: CustomerEstimateInput): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Your waterproofing estimate from ${site.name}`;
  const firstName = input.name.split(" ")[0] || input.name;

  const scope =
    input.service === "interior"
      ? "interior basement waterproofing"
      : "exterior foundation waterproofing";
  const scopeLine = `${scope}${input.linearFeet ? `, approx. ${input.linearFeet} linear ft` : ""}`;

  const netLow = Math.max(0, input.finalLow - input.rebateAmount);
  const netHigh = Math.max(0, input.finalHigh - input.rebateAmount);
  const rebateBlock =
    input.rebateAmount > 0
      ? `
    <p style="margin:14px 0 4px;color:#8395a7;">Estimated municipal rebate (eligible items, subject to city approval):</p>
    <p style="margin:0;font-weight:bold;">−${money(input.rebateAmount)}${input.rebateCity ? ` (${input.rebateCity})` : ""}</p>
    <p style="margin:14px 0 4px;color:#8395a7;">Estimated net after rebate:</p>
    <p style="margin:0;font-size:18px;font-weight:bold;">${money(netLow)} – ${money(netHigh)}</p>`
      : "";

  const html = wrap(
    "Your estimate is ready",
    `
    <p>Hi ${firstName},</p>
    <p>Thanks for sending us photos of your property. Our team has reviewed them, and based on what we can see, here is your estimate for <strong>${scopeLine}</strong>:</p>
    <div style="background:#f2f5f9;border-radius:10px;padding:20px;margin:18px 0;text-align:center;">
      <p style="margin:0;color:#8395a7;font-size:12px;letter-spacing:1px;">ESTIMATED RANGE (BEFORE HST)</p>
      <p style="margin:6px 0 0;font-size:28px;font-weight:bold;color:#3a6d8f;">${money(input.finalLow)} – ${money(input.finalHigh)}</p>
      ${rebateBlock}
    </div>
    <p style="font-size:13px;color:#5b6b7b;">This range is a preliminary estimate based on the photographs and information you provided. The final price is confirmed with a free on-site assessment — hidden conditions (soil, utilities, foundation state) can affect it. The estimate is valid for ${input.validDays} days. Any rebate figure is an estimate only and subject to your municipality's approval.</p>
    <p>Ready for the next step? Reply to this email or call us at <strong>${site.phone}</strong> to book your free on-site visit.</p>
    <p style="margin-top:20px;">— The ${site.name} team</p>`
  );

  const text = [
    `Hi ${firstName},`,
    "",
    `Thanks for sending us photos of your property. Here is your estimate for ${scopeLine}:`,
    "",
    `Estimated range (before HST): ${money(input.finalLow)} – ${money(input.finalHigh)}`,
    ...(input.rebateAmount > 0
      ? [
          `Estimated municipal rebate (eligible items, subject to city approval): -${money(input.rebateAmount)}`,
          `Estimated net after rebate: ${money(netLow)} – ${money(netHigh)}`,
        ]
      : []),
    "",
    `This is a preliminary estimate based on your photos; the final price is confirmed with a free on-site assessment. Valid for ${input.validDays} days.`,
    "",
    `Book your free site visit: ${site.phone}`,
    `— The ${site.name} team`,
  ].join("\n");

  return { subject, html, text };
}
