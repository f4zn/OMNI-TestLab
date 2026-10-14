# OMNI TestLab — UX Ground Truth

This document is an evaluation reference for OMNI. These 15 issues are intentional. The website does not expose this document, issue IDs, or a warning about the planted issues.

## Evaluation setup

- Run `npm install` and `npm run dev`, then open Vite's printed URL.
- Use a desktop viewport such as **1440 × 900** for UX-001 through UX-011.
- Use a **390 × 844 CSS-pixel viewport** for UX-012 through UX-015. Browser device emulation is sufficient.
- Start each independent account test signed out. The deterministic login is `demo@omni.test` / `OmniDemo123!`.
- For cart and checkout tests, add at least one product from `/products`.
- Error messages clear after **1,800 milliseconds**. Observe promptly or record the interaction to verify this timing.
- To reset all local state, run `localStorage.removeItem('omni-testlab:v1'); location.assign('/');` in the app-origin browser console. Reset removes locally created accounts and orders but preserves the built-in demo login.
- Use fake names, addresses, and email addresses. Checkout does not contact a payment service or create a real order.

Severity describes the effect on the affected persona: **High** significantly obstructs a core journey; **Medium** adds material confusion or effort; **Low** is a limited nuisance. The issues remain present during successful journeys.

## UX-001 — Password requirements are disclosed only after failure

- **Page:** Signup, `/login?mode=signup`
- **Affected persona:** First-time user
- **Severity:** Medium
- **Description:** Registration provides no advance guidance about its password policy. A user learns the requirements only by submitting a rejected password.
- **Reproduction steps:**
  1. Sign out if necessary, then open `/login?mode=signup`.
  2. Inspect the password field before entering anything. No list of password requirements is visible.
  3. Enter a name, a new validly formatted fake email address, and the password `simple`.
  4. Select **Continue**.
  5. Observe the validation message describing the password requirements.
- **Expected correct UX behavior:** Show the complete password policy beside the field before submission and give persistent, actionable validation feedback. The actual policy is at least eight characters, lowercase, uppercase, a digit, and a special character from `!@#$%^&*`.

## UX-002 — Registration action is ambiguously labeled

- **Page:** Signup, `/login?mode=signup`
- **Affected persona:** First-time user
- **Severity:** Medium
- **Description:** The action that creates an account is labeled **Continue**, concealing its immediate effect.
- **Reproduction steps:**
  1. Open `/login?mode=signup` while signed out.
  2. Fill the form with a name, an unused fake email address, and `OmniDemo123!`.
  3. Inspect the submit button: it reads **Continue**.
  4. Select it and observe that the account is created and the user is signed in.
- **Expected correct UX behavior:** Label the action **Create Account** or an equally explicit phrase that communicates account creation.

## UX-003 — Login failure gives no actionable explanation

- **Page:** Login, `/login`
- **Affected persona:** First-time user
- **Severity:** Medium
- **Description:** Invalid login credentials produce the vague message **Something went wrong**.
- **Reproduction steps:**
  1. Sign out if necessary, then open `/login`.
  2. Enter `demo@omni.test` and the incorrect password `WrongPassword123!`.
  3. Submit the form.
  4. Observe **Something went wrong** rather than a useful explanation or recovery guidance.
- **Expected correct UX behavior:** Explain that the email or password was not accepted and provide a clear way to retry, without revealing whether an account exists.

## UX-004 — Navigation labels obscure destinations

- **Page:** Global header on all pages
- **Affected persona:** First-time user
- **Severity:** Medium
- **Description:** Primary navigation uses **Discover**, **The Edit**, and **Your Space** instead of clear destination names.
- **Reproduction steps:**
  1. Open `/` in a desktop viewport.
  2. Inspect the main navigation without following its links.
  3. Follow **The Edit** and observe that it opens the product listing at `/products`.
  4. Follow **Your Space** and observe that it opens the account page at `/login`.
  5. Follow **Discover** and observe that it returns to the home page at `/`.
- **Expected correct UX behavior:** Use recognizable labels such as **Home**, **Shop**, and **Account** to make destinations predictable.

## UX-005 — Important purchase information is unusually small

- **Page:** Shopping cart, `/cart`
- **Affected persona:** Older / low-tech user
- **Severity:** Medium
- **Description:** Important supporting purchase information uses a 10px font, making it hard to read at normal zoom.
- **Reproduction steps:**
  1. Add a product from `/products` and open `/cart`.
  2. Keep browser zoom at 100%.
  3. Inspect the order summary's text beginning **Standard delivery: 3–5 business days** and its shipping price / tax information.
  4. Compare it with the cart's ordinary body text; browser developer tools can confirm the 10px font size.
- **Expected correct UX behavior:** Present shipping, purchase, and other important information at a comfortably readable size, with an appropriate line height and scalable text.

## UX-006 — Secondary text has insufficient contrast

- **Page:** Storefront secondary text, including product listing and cart
- **Affected persona:** Older / low-tech user
- **Severity:** Medium
- **Description:** Secondary text styled with `.muted` uses `#a6a3ad` on a white or similarly light surface, reducing readability.
- **Reproduction steps:**
  1. Open `/products` in a desktop viewport.
  2. Inspect the pale secondary text around the listing and products.
  3. Compare it with primary product names or prices on the same light surface.
  4. Inspect an element with the `.muted` class to confirm the foreground color.
- **Expected correct UX behavior:** Use sufficient text/background contrast for the text size; normal text should meet a contrast ratio of at least 4.5:1.

## UX-007 — Action icons lack visible labels

- **Page:** Global header and product cards on `/products`
- **Affected persona:** Older / low-tech user
- **Severity:** Medium
- **Description:** Account, shopping bag, and product-save actions are represented by icons without visible explanatory text. Accessible names do not resolve the discoverability problem for sighted users unfamiliar with those symbols.
- **Reproduction steps:**
  1. Open `/products`.
  2. Inspect the account and shopping bag controls in the header.
  3. Inspect the save control on a product card.
  4. Observe that the controls show symbols without visible **Account**, **Bag**, or **Save** labels.
  5. Activate the controls to verify that they perform real actions despite their unclear presentation.
- **Expected correct UX behavior:** Pair unfamiliar or important icons with persistent visible text labels while retaining accessible names.

## UX-008 — Validation messages disappear too quickly

- **Page:** Login / signup and checkout
- **Affected persona:** Older / low-tech user
- **Severity:** High
- **Description:** Custom form errors automatically disappear after 1.8 seconds, even when the incorrect or missing input remains unchanged.
- **Reproduction steps:**
  1. Open `/login` while signed out.
  2. Enter `demo@omni.test` and `WrongPassword123!`, then submit.
  3. Observe the error message immediately.
  4. Leave the fields untouched for two seconds.
  5. Observe that the error has disappeared while the credentials remain invalid.
  6. For the checkout variant, complete **Delivery**, then enter a different nonempty name and a validly formatted email in **Contact** and select **Continue to review**. The message **Your contact details must match the delivery details.** disappears after the same interval.
- **Expected correct UX behavior:** Keep validation errors visible until the user corrects the input, successfully resubmits, or explicitly dismisses them. Associate field errors with the affected inputs.

## UX-009 — Checkout requires redundant confirmations

- **Page:** Checkout, `/checkout`
- **Affected persona:** Expert user
- **Severity:** Medium
- **Description:** After shipping and contact details and an order review, checkout inserts two additional confirmation screens before the user can place an order.
- **Reproduction steps:**
  1. Add a product and proceed from `/cart` to `/checkout`.
  2. Complete **Delivery** with fake valid details and select **Continue to contact**.
  3. Repeat the same name and email in **Contact**, then select **Continue to review**.
  4. Review the order and select **Confirm details**.
  5. Observe the additional **Confirm** screen. Check **I confirm these delivery details are correct.** and select **Continue to final check**.
  6. Observe the additional **Complete** screen. Check **I have reviewed my order and am ready to continue.**
  7. Select **Place order** and observe that the journey still completes.
- **Expected correct UX behavior:** Offer one clear final review with a **Place Order** action. Require additional confirmation only when a distinct consequential decision needs it.

## UX-010 — Filtering takes excessive interactions

- **Page:** Product listing, `/products`
- **Affected persona:** Expert user
- **Severity:** Medium
- **Description:** Selecting a product category requires opening the filters, choosing a category, reviewing it, confirming it, and applying it. The listing only updates after the final action.
- **Reproduction steps:**
  1. Open `/products` with no active category filter.
  2. Open **Filters**.
  3. Select a category other than the all-products option.
  4. Select **Review selection**.
  5. Select **Confirm selection**.
  6. Select **Apply filters**.
  7. Observe that the results change only after the final action.
- **Expected correct UX behavior:** Apply a simple category selection immediately or with one clearly labeled apply action; avoid multiple confirmation screens for a reversible filter.

## UX-011 — Checkout asks for contact details twice

- **Page:** Checkout, `/checkout`
- **Affected persona:** Expert user
- **Severity:** Medium
- **Description:** A later checkout form requests the name and email already entered during shipping, without prefilling them.
- **Reproduction steps:**
  1. Add a product and open `/checkout`.
  2. Enter a name, fake email address, and the required shipping information.
  3. Select **Continue to contact** to enter the **Contact** stage.
  4. Observe empty name and email fields asking for the same information.
  5. Re-enter the information and continue to verify that the duplicate entry is part of the normal successful path.
- **Expected correct UX behavior:** Reuse the information already entered and let the user edit it. If a separate recipient or billing contact is needed, clearly explain that distinction and provide an easy same-as-shipping option.

## UX-012 — Mobile touch controls are too small

- **Page:** Product cards and cart at mobile width
- **Affected persona:** Mobile user
- **Severity:** Medium
- **Description:** Controls styled with `.touch-small` are 24 × 24 CSS pixels at all widths, making precise touch interaction especially difficult on mobile.
- **Reproduction steps:**
  1. Set the viewport to 390 × 844 CSS pixels.
  2. Open `/products` and inspect a product's small icon control.
  3. Add a product, open `/cart`, and inspect the compact quantity controls.
  4. Use developer tools to inspect a `.touch-small` button and confirm its 24 × 24px dimensions.
- **Expected correct UX behavior:** Provide comfortably sized touch targets, commonly at least 44 × 44 CSS pixels, with enough separation to prevent accidental activation.

## UX-013 — Product cards overflow the mobile viewport

- **Page:** Product listing, `/products`, and featured products on `/`
- **Affected persona:** Mobile user
- **Severity:** High
- **Description:** At widths up to 600px, the product grid retains two columns with a minimum card width of 300px. It exceeds narrow screens and requires horizontal scrolling.
- **Reproduction steps:**
  1. Set the viewport to 390 × 844 CSS pixels and open `/products`.
  2. Scroll vertically to the product grid.
  3. Observe a second column extending beyond the right edge.
  4. Scroll horizontally to view the hidden card content and actions.
- **Expected correct UX behavior:** Adapt the listing to a single column or fluid cards that fit the viewport without horizontal scrolling.

## UX-014 — Mobile checkout fields are cramped

- **Page:** Checkout, `/checkout`
- **Affected persona:** Mobile user
- **Severity:** High
- **Description:** The mobile checkout form retains a two-column field layout with only a 4px gap. Its layout has a minimum width of 620px, producing cramped grouping and overflow on narrow screens.
- **Reproduction steps:**
  1. Add a product to the cart.
  2. Set the viewport to 390 × 844 CSS pixels and open `/checkout`.
  3. Inspect the shipping form's labels and adjacent inputs.
  4. Observe that fields remain in two columns with minimal separation instead of stacking for mobile.
  5. Move horizontally to inspect the portion outside the initial viewport.
- **Expected correct UX behavior:** Stack form fields where needed, fit the viewport, and provide enough spacing to make labels, inputs, and validation messages easy to distinguish and use.

## UX-015 — The primary checkout action is off-screen on mobile

- **Page:** Checkout, `/checkout`
- **Affected persona:** Mobile user
- **Severity:** High
- **Description:** The primary checkout button is aligned at the far right of an oversized checkout layout. On a narrow viewport it sits outside the initial visible area and requires horizontal scrolling to reach.
- **Reproduction steps:**
  1. Add a product and set the viewport to 390 × 844 CSS pixels.
  2. Open `/checkout` with the horizontal scroll position at the far left.
  3. Scroll vertically to the shipping form's primary action.
  4. Observe that the full primary button cannot be reached in the initial viewport.
  5. Scroll horizontally to the right to reveal it and continue checkout.
- **Expected correct UX behavior:** Keep the primary action clearly visible and comfortably reachable within the viewport, using a responsive full-width or appropriately placed action area.
