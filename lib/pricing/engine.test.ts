import { describe, it, expect } from "vitest";
import { calculateEstimate, PricingInputError } from "./engine";
import type { EstimateInput, EstimateResult } from "./types";

describe("calculateEstimate — base exterior", () => {
  it("prices a standard 40 ft job at the base $275/ft with no modifiers", () => {
    const r = calculateEstimate({
      service: "exterior",
      linearFeet: 40,
      depth: "up_to_7",
      access: "machine",
      location: "belt_905",
      houseAge: "post_1980",
    });

    expect(r.effectivePerFoot).toBe(275);
    expect(r.waterproofingSubtotal).toBe(11000);
    expect(r.minimumApplied).toBe(false);
    expect(r.calculatedTotal).toBe(11000);
    expect(r.rangeLow).toBe(10450); // -5%
    expect(r.rangeHigh).toBe(12650); // +15%
    expect(r.rebate.estimatedRebate).toBe(0);
  });

  it("stacks depth, access, location and age multiplicatively (~$680/ft)", () => {
    // The worst-case example quoted to the client: 9 ft, Toronto core,
    // pre-1950, hand dig -> ~$680/ft. Confirms multipliers compound.
    const r = calculateEstimate({
      service: "exterior",
      linearFeet: 40,
      depth: "nine_plus",
      access: "hand_dig",
      location: "toronto_core",
      houseAge: "pre_1950",
      obstructions: [{ label: "deck footing" }], // default $1,000
      siteWork: ["concreteRemoveRepour"], // $1,800
    });

    expect(r.effectivePerFoot).toBeCloseTo(680.63, 1);
    // base 27,225 + concrete 1,800 + obstruction 1,000
    expect(r.waterproofingSubtotal).toBe(30025);
    expect(r.calculatedTotal).toBe(30025);
    expect(r.rangeLow).toBe(28524);
    expect(r.rangeHigh).toBe(34529);
  });
});

describe("calculateEstimate — minimum job floor", () => {
  it("floors a tiny interior job at the $2,800 minimum", () => {
    const r = calculateEstimate({
      service: "interior",
      linearFeet: 10, // 10 × $120 = $1,200, below the minimum
      location: "belt_905",
      houseAge: "post_1980",
    });

    expect(r.effectivePerFoot).toBe(120);
    expect(r.minimumApplied).toBe(true);
    expect(r.waterproofingSubtotal).toBe(2800);
    expect(r.calculatedTotal).toBe(2800);
  });

  it("does NOT apply the minimum to an add-on-only job (no waterproofing)", () => {
    const r = calculateEstimate({
      service: "exterior",
      linearFeet: 0,
      location: "belt_905",
      houseAge: "post_1980",
      sump: { pumpReplacement: true }, // $900 only
    });

    expect(r.effectivePerFoot).toBeNull();
    expect(r.minimumApplied).toBe(false);
    expect(r.calculatedTotal).toBe(900);
  });
});

describe("calculateEstimate — Toronto rebate", () => {
  it("caps each eligible item and adds the assessment credit", () => {
    const r = calculateEstimate({
      service: "exterior",
      linearFeet: 30,
      depth: "up_to_7",
      location: "belt_905", // isolate multipliers to 1.0 for a clean assertion
      houseAge: "post_1980",
      sump: { newPitPump: true, batteryBackup: true },
      backwaterValve: true,
      rebateCity: "toronto",
    });

    // waterproofing 8,250 + backwater 3,400 + sump 2,200 + battery 1,300
    expect(r.calculatedTotal).toBe(15150);

    // backwater min(3400,1600)=1600 + sump min(2200,2250)=2200
    //  + battery min(1300,300)=300 + $500 assessment credit = 4,600
    expect(r.rebate.estimatedRebate).toBe(4600);
    expect(r.netAfterRebateLow).toBe(r.rangeLow - 4600);
    expect(r.netAfterRebateHigh).toBe(r.rangeHigh - 4600);
  });

  it("never rebates against membrane waterproofing", () => {
    // Big exterior job, no eligible add-ons -> zero rebate even in Toronto.
    const r = calculateEstimate({
      service: "exterior",
      linearFeet: 60,
      depth: "eight_ft",
      location: "toronto_core",
      houseAge: "pre_1950",
      rebateCity: "toronto",
    });
    expect(r.rebate.estimatedRebate).toBe(0);
  });
});

describe("calculateEstimate — validation", () => {
  it("throws when an exterior job is missing depth", () => {
    expect(() =>
      calculateEstimate({
        service: "exterior",
        linearFeet: 40,
        location: "belt_905",
        houseAge: "post_1980",
      } as EstimateInput)
    ).toThrow(PricingInputError);
  });

  it("throws on negative linear feet", () => {
    expect(() =>
      calculateEstimate({
        service: "interior",
        linearFeet: -5,
        location: "belt_905",
        houseAge: "post_1980",
      })
    ).toThrow(PricingInputError);
  });
});

// --- Human-readable demo so real quote numbers show in the test output ---
describe("demo quotes", () => {
  const scenarios: { title: string; input: EstimateInput }[] = [
    {
      title: "Standard bungalow, 40 ft, 7 ft deep, Oshawa (outer GTA)",
      input: {
        service: "exterior",
        linearFeet: 40,
        depth: "up_to_7",
        access: "machine",
        location: "outer_gta",
        houseAge: "1950_1980",
      },
    },
    {
      title: "Tough Toronto job, 45 ft, 9 ft deep, pre-1950, hand dig, deck + AC",
      input: {
        service: "exterior",
        linearFeet: 45,
        depth: "nine_plus",
        access: "hand_dig",
        location: "toronto_core",
        houseAge: "pre_1950",
        obstructions: [{ label: "deck footing" }, { label: "AC unit", cost: 1500 }],
        siteWork: ["interlockRelay"],
        rebateCity: "toronto",
      },
    },
    {
      title: "Full flood package, 35 ft + backwater + sump + battery, Mississauga",
      input: {
        service: "exterior",
        linearFeet: 35,
        depth: "eight_ft",
        location: "belt_905",
        houseAge: "1950_1980",
        backwaterValve: true,
        weepingTileDisconnect: true,
        sump: { newPitPump: true, batteryBackup: true },
        rebateCity: "mississauga",
      },
    },
    {
      title: "Interior system, 50 ft, North York",
      input: {
        service: "interior",
        linearFeet: 50,
        location: "toronto_suburbs",
        houseAge: "1950_1980",
        sump: { newPitPump: true },
        rebateCity: "toronto",
      },
    },
  ];

  it("prints formatted example quotes", () => {
    const lines: string[] = ["", "══ DryFort quote engine — sample quotes ══", ""];
    for (const s of scenarios) {
      const r = calculateEstimate(s.input);
      lines.push(`▸ ${s.title}`);
      for (const li of r.lineItems) {
        lines.push(`    ${li.label.padEnd(52)} ${money(li.amount)}`);
      }
      lines.push(`    ${"Quote range".padEnd(52)} ${money(r.rangeLow)} – ${money(r.rangeHigh)}`);
      if (r.rebate.estimatedRebate > 0) {
        lines.push(`    ${`Est. ${r.rebate.city} rebate`.padEnd(52)} -${money(r.rebate.estimatedRebate)}`);
        lines.push(`    ${"Net after rebate".padEnd(52)} ${money(r.netAfterRebateLow)} – ${money(r.netAfterRebateHigh)}`);
      }
      lines.push("");
    }
    // eslint-disable-next-line no-console
    console.log(lines.join("\n"));
    expect(scenarios.length).toBeGreaterThan(0);
  });
});

function money(n: number): string {
  return "$" + n.toLocaleString("en-CA");
}

// silence "unused" on the imported result type in strict setups
export type _Result = EstimateResult;
