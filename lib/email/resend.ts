import "server-only";

/**
 * Minimal Resend client via plain fetch — no SDK dependency.
 *
 * Demo-mode aware: without RESEND_API_KEY, sendEmail() logs and reports
 * {sent:false} instead of throwing, so every flow keeps working before the
 * email account exists.
 *
 * Note: until a sending domain is verified in Resend, the default
 * `onboarding@resend.dev` sender can only deliver to the Resend account
 * owner's own address — fine for testing, set EMAIL_FROM after verifying
 * the real domain.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const DEFAULT_FROM = "DryFort Waterproofing <onboarding@resend.dev>";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Where owner alerts go. */
export function ownerAlertAddress(): string {
  return process.env.OWNER_ALERT_EMAIL ?? "gabbymayuga77@gmail.com";
}

/** Base URL used in dashboard links inside emails. */
export function appBaseUrl(): string {
  return process.env.APP_BASE_URL ?? "http://localhost:3000";
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface SendEmailResult {
  sent: boolean;
  error?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipped "${input.subject}" to ${input.to}`
    );
    return { sent: false, error: "Email is not configured." };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? DEFAULT_FROM,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[email] Resend ${res.status}:`, body.slice(0, 500));
      return { sent: false, error: `Email provider error (${res.status}).` };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { sent: false, error: "Email send failed." };
  }
}
