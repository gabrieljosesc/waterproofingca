"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

const MIN_FEET = 10;
const MAX_FEET = 200;

/**
 * Instant estimate widget: linear feet × the published exterior rate range
 * ($250 to $350 / ft). Produces a low-to-high budget range, since the real
 * rate depends on access and site conditions.
 */
export function CostCalculator() {
  const [feet, setFeet] = useState(40);
  const estimateLow = feet * site.pricing.exteriorMin;
  const estimateHigh = feet * site.pricing.exteriorMax;
  const monthlyLow =
    Math.round(estimateLow / site.financing.exampleTermMonths / 5) * 5;

  return (
    <div className="calculator">
      <h3>Instant Exterior Waterproofing Estimate</h3>
      <p className="calculator__hint">
        Measure the length of foundation wall that needs waterproofing, slide,
        and you have a realistic budget — before anyone visits your home.
      </p>

      <div className="calculator__row">
        <label htmlFor="feet">
          Foundation length: <strong>{feet} linear ft</strong>
        </label>
        <input
          id="feet"
          type="range"
          min={MIN_FEET}
          max={MAX_FEET}
          step={5}
          value={feet}
          onChange={(e) => setFeet(Number(e.target.value))}
        />
        <div className="calculator__scale">
          <span>{MIN_FEET} ft</span>
          <span>one wall ≈ 20–40 ft</span>
          <span>{MAX_FEET} ft</span>
        </div>
      </div>

      <div className="calculator__result">
        <div>
          <div className="calculator__label">Estimated range</div>
          <div className="calculator__figure">
            ${estimateLow.toLocaleString("en-CA")} to $
            {estimateHigh.toLocaleString("en-CA")}
          </div>
          <div className="calculator__math">
            {feet} ft × ${site.pricing.exteriorMin} to $
            {site.pricing.exteriorMax}/ft · CAD, before HST
          </div>
          <div className="calculator__finance">
            or from{" "}
            <strong>~${monthlyLow.toLocaleString("en-CA")}/mo</strong> with
            financing
          </div>
        </div>
        <Link href="/contact" className="btn btn--primary">
          Confirm With a Free Quote
        </Link>
      </div>

      <p className="form__note">
        Ballpark for full exterior waterproofing (excavation, membrane,
        drainage board, new weeping tile). Interior systems, crack injections
        and sump pumps are quoted per project. Final pricing is confirmed with
        a free on-site assessment. Commercial runs qualify for volume pricing.
      </p>
    </div>
  );
}
