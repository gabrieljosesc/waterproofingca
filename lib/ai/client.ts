import "server-only";
import Anthropic from "@anthropic-ai/sdk";

/**
 * Model used to read site conditions from customer photos.
 *
 * Claude Sonnet 5 is the deliberate choice here (per our cost discussion): it
 * has strong vision and sits well below Opus pricing, and every AI estimate is
 * reviewed and approved by the owner before a customer sees a price, so we
 * don't need the top-tier model for this perception task. Change this one
 * constant to `claude-opus-5` if you ever want maximum accuracy.
 */
export const VISION_MODEL = "claude-sonnet-5";

/** True when an Anthropic API key is configured. */
export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** Server-only Anthropic client. Reads ANTHROPIC_API_KEY from the environment. */
export function createAiClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set.");
  }
  return new Anthropic();
}
