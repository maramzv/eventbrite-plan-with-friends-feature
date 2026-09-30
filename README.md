# Eventbrite Plan With Friends

A class project: a faithful clone of Eventbrite's homepage and event pages, used as the foundation for a new feature, **Plan with Friends**, which lets friends coordinate attending an event together before registering.

The goal is to practice what a product team does in a real role: adding a feature to an existing product while keeping its brand guidelines intact.

## Status

- **Eventbrite foundation (Mara, branch `cloning-EB`)**: done. Homepage, event pages, and the ticket checkout popup.
- **Plan with Friends feature (Michelle, own branch)**: not started in this branch. See `PRD-new-feature`.

## Run it

Requires Node 20+.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.


## What's in the clone

| Page | Route | Notes |
|---|---|---|
| Presentation intro | `/intro` | 5 slides for opening the demo (problem, research, solution). Arrow keys or buttons to move; "Start the demo" goes to the homepage. Not part of the Eventbrite clone. |
| Homepage | `/` | Hero banner, category icons, "Browsing events in" bar + tabs, 16 event cards, Top destinations carousel, Popular cities / Explore by State / Things to do link rows, footer |
| Event page | `/e/:slug` | Hero gallery, urgency tag, organizer, sticky price box, Overview (Read more), Lineup, Good to know, Location, FAQs, Organized by, More events from organizer, You might also like, tags, footer |
| Ticket popup | opens from the price box | Ticket list with quantity steppers, promo code, order summary, refund box; date → time → tickets flow for multi-date events |

Every homepage card opens its own event page (17 real events). The price box button covers all of Eventbrite's variants: **Get tickets**, **Reserve a spot**, **Check availability**, **Join Waitlist**, and sold out.

Links and buttons that lead outside this slice (nav links, footer links, Follow, Continue/Register in checkout, etc.) are intentionally inert.

## How it's built

- React + Vite + TypeScript, React Router, Tailwind CSS v4
- Eventbrite's own font (Founders Grotesk), images, and map are loaded from Eventbrite's CDN, not stored in this repo
- Colors, sizes, and spacing were measured from the live site (see `@theme` in `src/index.css`)

```
src/
  data/          # JSON extracted from real Eventbrite pages + typed helpers (index.ts)
  components/    # Header, footers, Svg, home/, event/, checkout/
  pages/         # Home, EventPage, NotFound
  utils/         # formatting helpers
```

All event content lives in `src/data/events.json`; homepage content in `src/data/home.json`. HTML and SVG in these files were sanitized when extracted (formatting tags and SVG shapes only).

## For the Plan with Friends feature

- The event page is `src/pages/EventPage.tsx`; each section is its own component in `src/components/event/`.
- The price box (the path to registration) is `src/components/event/ConversionBar.tsx`, and the checkout popup is `src/components/checkout/CheckoutModal.tsx`.
- Reuse the Tailwind color tokens (`eb-orange`, `eb-ink`, `eb-blue`, etc.) so new screens match Eventbrite's visual language.

## Demo requirements

- Prepare either a short Loom walkthrough or a couple of dedicated slides to accompany the live demo.
- Keep the complete presentation to 3–4 minutes.
- Show the existing event experience first, then the updated event page and friends-planning flow. Use before-and-after screenshots where helpful.

## Disclaimer

A student project for educational purposes. Not affiliated with or endorsed by Eventbrite. Event content belongs to its respective organizers.
