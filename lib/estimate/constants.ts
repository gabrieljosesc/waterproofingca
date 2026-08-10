/** Below this AI confidence we don't show the customer a number — the site
 *  visit does the talking instead (the client's own spec rule: <50% → no
 *  automatic price). Shared between the analyze route and the accept route
 *  so a low-confidence estimate can never be accepted either. */
export const SHOW_PRICE_MIN_CONFIDENCE = 50;

/** Refundable deposit percentage to reserve a customer's priority slot,
 *  per the client's decision. Collected by phone on the owner's existing
 *  terminal — never captured on this site. */
export const DEPOSIT_PERCENT = 20;
