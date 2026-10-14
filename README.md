# OMNI TestLab

A complete React + Vite storefront for evaluating **OMNI**, an AI-powered, persona-based UX testing plugin. The application uses JavaScript, plain CSS, local product data, and simulated account, shopping, and checkout flows.

Repository: [github.com/umar967/OMNI-TestLab](https://github.com/umar967/OMNI-TestLab)

```sh
git clone https://github.com/umar967/OMNI-TestLab.git
cd OMNI-TestLab
```

The storefront deliberately includes 15 reproducible usability issues. Their ground truth is documented in [`UX_ISSUES.md`](UX_ISSUES.md), which is not part of the application UI.

## Requirements

- Node.js **22.12.0 or newer** and npm
- A modern browser

## Install and run

From the project directory:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, normally **http://127.0.0.1:5173**. Keep that terminal running while using the application. Stop the server with `Ctrl+C`.

If PowerShell blocks the `npm.ps1` script, use `npm.cmd install` and `npm.cmd run dev` instead.

## Build and preview

```sh
npm run build
npm run preview
```

The production output is written to `dist/`. Preview normally runs at **http://127.0.0.1:4173**; use the URL printed by the command. A production host must serve `index.html` for unknown application routes so direct links such as `/cart` work.

Run the logic checks with:

```sh
npm test
```

## Demo account and repeatable journeys

Use these deterministic credentials on `/login`:

```text
Email:    demo@omni.test
Password: OmniDemo123!
```

You can also create a local account. The signup password must contain at least eight characters, a lowercase letter, an uppercase letter, a digit, and one character from `!@#$%^&*`. The interface intentionally reveals these requirements only after an invalid submission.

A complete journey is available without signing in:

1. Open **The Edit** to browse `/products`.
2. Add products to the bag, then open `/cart`.
3. Adjust quantities if desired and proceed to `/checkout`.
4. Complete **Delivery**, repeat the same name and email in **Contact**, and continue to **Review**.
5. Select **Confirm details**, check the delivery confirmation, select **Continue to final check**, check the order confirmation, and select **Place order**.
6. View the simulated order confirmation.

Registration and login can be exercised before this journey. Product search, sorting, category filtering, saved products, cart removal, and guest checkout use local state.

Use made-up contact and shipping details. There is no backend, database, payment processor, or real order fulfillment. Product information and assets are local. Account credentials and other demo state are stored in the browser, so this application is for local evaluation and must not be used with real passwords or customer data.

## Resetting an evaluation

The application persists state under the localStorage key `omni-testlab:v1`. To begin again, open the browser developer console at the app's origin and run:

```js
localStorage.removeItem('omni-testlab:v1');
location.assign('/');
```

This clears locally registered accounts, session state, saved products, cart contents, and order state. The built-in demo credentials remain available. Order identifiers restart from `OMNI-1001` after reset.

Use the same origin throughout an evaluation: `localhost`, `127.0.0.1`, and different ports have separate browser storage. The dev server and production preview therefore have independent state.

## Pages

- `/` — home and featured products
- `/login` — login
- `/login?mode=signup` — registration
- `/products` — product listing, search, sorting, and filtering
- `/cart` — cart quantities and totals
- `/checkout` — delivery, repeated contact details, review, confirmations, and order completion

## Project structure

- `src/pages/` — home, catalog, account, cart, and checkout pages
- `src/components/` — shared layout, icons, product cards, dialogs, and order summary
- `src/context/ShopContext.jsx` — browser-local accounts, cart, saved items, and orders
- `src/lib/shop.js` — validation, totals, filtering, and persisted-state sanitization
- `src/data/products.js` and `public/images/` — eight mock products and original local SVG artwork
- `src/styles.css` — storefront styling and annotated intentional responsive issues
- `tests/shop.test.js` — deterministic logic checks

## Evaluation notes

See [`UX_ISSUES.md`](UX_ISSUES.md) for all 15 issue IDs, affected personas, severity, precise reproduction steps, and expected correct behavior. Use a **390 × 844 CSS-pixel viewport** to reproduce mobile issues consistently. Error messages intentionally clear after **1.8 seconds**.

Keep evaluation documentation outside `public/` and application imports; it is not displayed by the storefront or included in the production bundle.

## Verification

The completed project passed the production build and all five Node logic tests. Browser walkthroughs verified registration, hidden password rules, transient login errors, demo login, session persistence, saved products, category filtering, quantity updates, and successful signed-in and guest checkout using both payment options. No browser runtime errors were observed.

At 390px viewport width, browser measurements confirmed 24px icon controls, 300px product cards, a 620px checkout layout, 4px field gaps, and the primary checkout action beyond the initial viewport. These are intentional evaluation conditions. Use the reset instructions above before each clean evaluation.
