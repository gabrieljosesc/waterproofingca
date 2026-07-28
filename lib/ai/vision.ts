import "server-only";
import { createAiClient, VISION_MODEL } from "./client";

/** What the AI reads from the customer's photos. Mirrors the pricing engine's
 *  condition inputs so it can be mapped straight into an estimate. */
export interface SiteConditions {
  /** Can machine reach the wall, or is it a hand dig? */
  access: "machine" | "hand_dig" | "unknown";
  access_confidence: number; // 0-100
  /** Ground surfaces along the excavation line. */
  ground_surfaces: Array<
    | "grass"
    | "garden"
    | "gravel"
    | "interlock"
    | "concrete"
    | "asphalt"
    | "deck"
    | "unknown"
  >;
  /** Things at/near the wall that complicate the dig. */
  obstructions: Array<{ label: string; near_wall: boolean }>;
  foundation_type: "poured_concrete" | "block" | "stone" | "brick" | "unknown";
  visible_cracks: boolean;
  crack_count: number;
  leak_location_visible: "wall" | "floor" | "window" | "joint" | "none" | "unknown";
  grade_slope: "away" | "flat" | "toward" | "unknown";
  photo_quality: "good" | "fair" | "poor";
  overall_confidence: number; // 0-100
  summary: string;
}

/** JSON schema constraining the model's output (structured outputs). */
const CONDITIONS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    access: { type: "string", enum: ["machine", "hand_dig", "unknown"] },
    access_confidence: { type: "integer" },
    ground_surfaces: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "grass",
          "garden",
          "gravel",
          "interlock",
          "concrete",
          "asphalt",
          "deck",
          "unknown",
        ],
      },
    },
    obstructions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          near_wall: { type: "boolean" },
        },
        required: ["label", "near_wall"],
      },
    },
    foundation_type: {
      type: "string",
      enum: ["poured_concrete", "block", "stone", "brick", "unknown"],
    },
    visible_cracks: { type: "boolean" },
    crack_count: { type: "integer" },
    leak_location_visible: {
      type: "string",
      enum: ["wall", "floor", "window", "joint", "none", "unknown"],
    },
    grade_slope: { type: "string", enum: ["away", "flat", "toward", "unknown"] },
    photo_quality: { type: "string", enum: ["good", "fair", "poor"] },
    overall_confidence: { type: "integer" },
    summary: { type: "string" },
  },
  required: [
    "access",
    "access_confidence",
    "ground_surfaces",
    "obstructions",
    "foundation_type",
    "visible_cracks",
    "crack_count",
    "leak_location_visible",
    "grade_slope",
    "photo_quality",
    "overall_confidence",
    "summary",
  ],
} as const;

const SYSTEM_PROMPT = `You are a senior estimator at a Southern Ontario basement waterproofing company, reading customer-submitted photos of a foundation before quoting an exterior excavation job.

Read only what the photos actually show. Report site conditions that affect the cost and difficulty of digging along and waterproofing the foundation wall. Be conservative: when something is unclear or not visible, use "unknown" and lower your confidence rather than guessing.

Key judgements:
- access: "machine" if an excavator can plausibly reach and work along the wall (open side yard, driveway access, room to maneuver). "hand_dig" if the space is too tight for a machine (narrow side yard under ~3 ft, no gate wide enough, blocked by structures). "unknown" if you can't tell.
- ground_surfaces: what covers the ground along the wall that would have to be removed and restored (grass, garden bed, interlock, poured concrete, asphalt, deck, gravel).
- obstructions: things at or near the wall that complicate the dig — AC unit, gas meter, deck, porch, stairs, large tree, fence. Mark near_wall true only when it sits right against the excavation line.
- foundation_type: poured_concrete, block, stone, or brick, if visible.
- You cannot see excavation depth from a photo — never infer it.

Confidence is 0-100. Keep the summary to 1-2 plain sentences an estimator would jot down.`;

const USER_INSTRUCTIONS = `These are photos submitted by a homeowner requesting a waterproofing estimate. Analyze them and return the site conditions as structured JSON. If the photos are too dark, blurry, or incomplete to judge something, use "unknown" / "poor" and lower your confidence.`;

export interface PhotoInput {
  base64: string;
  mediaType: "image/jpeg" | "image/png" | "image/webp";
}

/** Send photos to Claude and get back structured site conditions. */
export async function analyzePhotos(
  photos: PhotoInput[]
): Promise<SiteConditions> {
  if (photos.length === 0) {
    throw new Error("No photos to analyze.");
  }

  const client = createAiClient();

  const imageBlocks = photos.map((p) => ({
    type: "image" as const,
    source: {
      type: "base64" as const,
      media_type: p.mediaType,
      data: p.base64,
    },
  }));

  const response = await client.messages.create({
    model: VISION_MODEL,
    max_tokens: 2000,
    // Perception/extraction task — no extended thinking needed, keeps it fast
    // and cheap. Every result is owner-reviewed regardless.
    thinking: { type: "disabled" },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [...imageBlocks, { type: "text", text: USER_INSTRUCTIONS }],
      },
    ],
    output_config: {
      format: { type: "json_schema", schema: CONDITIONS_SCHEMA },
    },
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("AI returned no structured output.");
  }

  return JSON.parse(textBlock.text) as SiteConditions;
}
