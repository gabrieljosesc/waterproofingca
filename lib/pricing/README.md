# Pricing engine

Deterministic quote calculator for the DryFort AI quote tool (Phase 1). Given a
set of site conditions — read from the customer's photos by the AI, plus their
intake answers — it applies the owner's rate sheet and returns an itemized
breakdown, a display range, and a municipal-rebate estimate.

This is the **core logic and the liability surface** of the whole product, so
it's kept pure, deterministic, and fully unit-tested. It has no I/O, no AI
calls, and no framework dependencies — it's just data in, quote out.

## Usage

```ts
import { calculateEstimate } from "@/lib/pricing";

const quote = calculateEstimate({
  service: "exterior",
  linearFeet: 45,
  depth: "nine_plus",
  access: "hand_dig",
  location: "toronto_core",
  houseAge: "pre_1950",
  obstructions: [{ label: "AC unit", cost: 1500 }],
  sump: { newPitPump: true, batteryBackup: true },
  backwaterValve: true,
  rebateCity: "toronto",
});
// quote.rangeLow / rangeHigh, quote.lineItems, quote.rebate, quote.netAfterRebate*
```

## The model

```
effective per-foot = depthRate × access × location × houseAge
base               = effective per-foot × linear feet
waterproofing      = base + site work + obstructions,
                     floored at the service minimum (only when feet > 0)
add-ons            = flat services (sump, backwater, cracks, wells, …)
total              = waterproofing + add-ons
range              = total −5% … +15%
rebate             = per eligible item, capped, per city
net                = range − rebate (never below 0)
```

Multipliers compound. The client's worst-case example — 9 ft, Toronto core,
pre-1950, hand dig — resolves to `450 × 1.25 × 1.10 × 1.10 = $680.63/ft`, which
is why the public site advertises "from $275/ft" and lets this engine produce
the real per-project number.

## Documented assumptions

These are choices, not facts from the rate sheet. The owner should confirm them;
they're easy to change in `engine.ts`.

1. **Location and house-age factors apply to the per-foot waterproofing work
   only**, not to flat add-ons — a sump pump costs the same across the GTA.
2. **The access (hand-dig) multiplier applies to exterior work only.** Interior
   still gets location + age factors.
3. **The service minimum floors the waterproofing bucket only.** An add-on-only
   job (e.g. a lone sump replacement) is not forced up to the minimum.
4. **Rebates apply only to eligible items** (backwater valve, sump pump, battery
   backup) — never to membrane waterproofing. The engine caps each item, adds
   Toronto's assessment credit, and caps the total at the program limit.

## To verify before go-live

- **All rate values** in `rateConfig.ts` — the owner fine-tunes before launch.
- **Mississauga / Markham rebate rules** — only Toronto's per-item caps are
  published in the rate sheet; the others use the program cap as a placeholder
  and must be confirmed with each city (amounts and rules change).
- Obstruction default ($1,000, mid of the $500–$1,500 range) — the AI/owner sets
  a real per-obstruction cost in practice.

In production, `rateConfig.ts` becomes the seed for an owner-editable
`rate_config` table in Supabase so pricing can be tuned without a code change.

## Tests

```bash
npm test          # run once
npm run test:watch
```

`engine.test.ts` covers base pricing, multiplier stacking, the minimum-job
floor, rebate capping, the "never rebate membrane" rule, and input validation.
It also prints formatted sample quotes so the numbers can be eyeballed.
