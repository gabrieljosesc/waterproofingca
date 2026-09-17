/**
 * Content + config for the "How We Repair a Leaking Foundation Crack" video
 * page (/crack-repair-process) and the matching homepage section.
 */

/**
 * YouTube video ID of the crack-repair explainer.
 *
 * Leave as "" until the video is uploaded — the pages then show the written
 * steps only. Once it's on YouTube, paste the ID here: for
 * youtube.com/watch?v=abc123XYZ the ID is "abc123XYZ".
 */
export const CRACK_REPAIR_VIDEO_ID: string = "";

export const CRACK_REPAIR_VIDEO_TITLE =
  "How We Repair a Leaking Foundation Crack";

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
