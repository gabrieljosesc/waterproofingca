/**
 * Content + config for the "How We Repair a Leaking Foundation Crack" video
 * page (/crack-repair-process) and the matching homepage section.
 */

/**
 * Self-hosted MP4 (served from /public). Set to "" to fall back to YouTube.
 * 720p H.264, ~1:33, re-encoded for web from the client's original.
 */
export const CRACK_REPAIR_VIDEO_SRC: string = "/videos/crack-repair-process.mp4";
export const CRACK_REPAIR_VIDEO_POSTER: string =
  "/videos/crack-repair-process-poster.jpg";

/**
 * YouTube video ID of the crack-repair explainer — used only when
 * CRACK_REPAIR_VIDEO_SRC is "". For youtube.com/watch?v=abc123XYZ the ID is
 * "abc123XYZ".
 */
export const CRACK_REPAIR_VIDEO_ID: string = "";

export const CRACK_REPAIR_VIDEO_TITLE =
  "How We Repair a Leaking Foundation Crack";
export const CRACK_REPAIR_VIDEO_DESCRIPTION =
  "DryFort Waterproofing's 7-step interior foundation crack repair: locate and mark the crack, cut a repair channel, chisel to sound concrete, clean and prep, apply crystalline waterproofing, pack with waterproof repair mortar, and finish flush with the wall.";
/** ISO 8601 duration, for VideoObject structured data. */
export const CRACK_REPAIR_VIDEO_DURATION = "PT1M33S";
export const CRACK_REPAIR_VIDEO_UPLOAD_DATE = "2026-09-18";

export const hasCrackRepairVideo = Boolean(
  CRACK_REPAIR_VIDEO_SRC || CRACK_REPAIR_VIDEO_ID
);

export type RepairStep = { title: string; text: string };

/** The crew's 7-step interior crack repair method, in order. */
export const crackRepairSteps: RepairStep[] = [
  {
    title: "Locate the leak",
    text: "We inspect the inside of the foundation wall and find the exact crack where water is getting in, then mark out the repair area along the full length of the crack.",
  },
  {
    title: "Cut along the repair area",
    text: "Using a grinder with a masonry blade, we cut carefully along both sides of the marked crack. This creates a controlled repair channel — the crack is opened up, not painted over.",
  },
  {
    title: "Chisel out the concrete",
    text: "With a hammer and masonry chisel we remove the concrete between the cuts, opening the channel wider and deeper than the original crack. That lets the repair material bond to solid, sound concrete instead of a weak surface. All loose concrete, dust and debris is removed.",
  },
  {
    title: "Prepare the area",
    text: "The open channel is thoroughly cleaned and prepared to the waterproofing product's requirements — including dampening the concrete when the product calls for it.",
  },
  {
    title: "Apply crystalline waterproofing",
    text: "A cementitious crystalline waterproofing material is applied directly onto the prepared concrete inside the channel and worked thoroughly against the surface, so it bonds inside the concrete rather than sitting on top of it.",
  },
  {
    title: "Rebuild and seal",
    text: "The channel is packed with a compatible waterproof repair mortar or hydraulic repair material, compacted firmly so there are no voids anywhere in the repair.",
  },
  {
    title: "Finish",
    text: "The repair is smoothed flush with the surrounding wall, and any final waterproofing coat the system calls for is applied.",
  },
];
