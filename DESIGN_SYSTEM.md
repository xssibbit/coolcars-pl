# CoolCars Design System

Inspired by the UI/UX Pro Max automotive guidance, adapted for a Polish vehicle dealership.

## Product pattern
- Hero-centric vehicle presentation with a direct catalog CTA.
- Feature-rich catalog with fast filtering and clear availability states.
- High-information vehicle detail page with sticky lead panel.
- Sales-oriented admin dashboard focused on inventory and inquiries.

## Visual language
- Base: Swiss/minimal information architecture.
- Automotive layer: large vehicle imagery, metallic/dark hero surfaces, restrained motion.
- Primary ink: `#0B0F14`.
- Accent/action: `#E63946`.
- Surface: `#FFFFFF`; background: `#F4F6F8`.
- Corners: 12–30px depending on hierarchy; cards use 20–24px.
- Motion: 180–400ms hover/scale only; `prefers-reduced-motion` is respected.

## UX rules
- Always show netto and brutto price together.
- Make vehicle status visible before a user opens the detail page.
- Keep filters persistent on desktop and linear on mobile.
- All admin editing uses explicit labeled fields; no hidden inline editing.
- Destructive admin actions require confirmation.
- User favorites require authentication; inquiries can be sent without an account.
- Keyboard focus is visible on links, buttons, inputs, selects and textareas.

## Responsive targets
- 375px mobile
- 768px tablet
- 1024px small desktop
- 1440px desktop
