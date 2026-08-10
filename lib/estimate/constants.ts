/** Below this AI confidence we don't show the customer a number — the site
 *  visit does the talking instead (the client's own spec rule: <50% → no
 *  automatic price). Shared between the analyze route and the accept route
 *  so a low-confidence estimate can never be accepted either. */
export const SHOW_PRICE_MIN_CONFIDENCE = 50;

/** Refundable deposit percentage to reserve a customer's priority slot,
 *  per the client's decision. Card details are captured on accept so the
 *  owner can charge this on their terminal from the admin dashboard; the
 *  full PAN is never stored in plain text in the database. */
export const DEPOSIT_PERCENT = 20;
