# CoolCars.pl — full-stack car dealership starter

A redesigned Polish vehicle-dealership experience inspired by the useful catalog structure of CoolCars, but rebuilt with a modern UX and role-based admin/user flows.

## Included

- Polish public homepage and catalog
- Filters by query, brand, category, year and max net price
- Vehicle detail pages with netto/brutto pricing
- User registration and login
- Signed HTTP-only JWT session cookie
- User favorites stored in the database
- Vehicle inquiry form stored in the database
- Protected `ADMIN` role
- Admin dashboard with inventory KPIs
- Admin CRUD: add, edit, delete vehicles
- Admin-editable brand, model, title, year, mileage, net price, VAT, category, fuel, gearbox, power, capacity, DMC, payload, location, description, image, featured flag and status
- Admin inquiry list
- PostgreSQL via Prisma for Vercel/production deployment
- Responsive design and reduced-motion support

## Stack

- Next.js App Router + TypeScript
- Prisma ORM
- PostgreSQL for persistent production data
- bcryptjs password hashing
- jose signed session cookies
- Zod validation
- Custom CSS design system (no UI framework dependency)

## Setup

```bash
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

### Demo accounts

Admin:
- `admin@coolcars.pl`
- `Admin123!`

User:
- `klient@coolcars.pl`
- `User123!`

Change/remove demo credentials before a real deployment.

## Admin

Open `/admin` after logging in as the admin. Changes in `/admin/pojazdy` are read directly from the same database as the public catalog, so changing price/mileage/status immediately changes the public site.

## Production notes

This Vercel-ready version uses PostgreSQL through Prisma. For the quickest deployment, create a Neon PostgreSQL database and put its connection string in `DATABASE_URL`. Store real vehicle photos in object storage (S3-compatible storage, Cloudinary or Supabase Storage) rather than the demo SVG assets.

Also add before launch:
- password reset / email verification
- CSRF strategy for any non-SameSite deployment model
- rate limiting on auth and inquiry routes
- RODO/GDPR consent and privacy pages
- real transactional email/CRM notification for inquiries
- image upload, optimization and moderation workflow
- audit log for admin edits
- backups and database monitoring

## Design

See `DESIGN_SYSTEM.md`. The interface follows the automotive direction from `nextlevelbuilder/ui-ux-pro-max-skill`: hero-centric presentation, strong imagery, motion used sparingly, comparison-ready structured data, financing cues and a sales-oriented dashboard.


## Deploy on Vercel (recommended)

This repository is prepared for PostgreSQL hosting (Neon, Supabase, or another managed PostgreSQL provider) and Vercel.

Set these Environment Variables in Vercel before the first deployment:

```env
DATABASE_URL=postgresql://...
SESSION_SECRET=use-a-long-random-secret-at-least-32-characters
ADMIN_EMAIL=your-email@example.com
NEXT_PUBLIC_SITE_NAME=CoolCars
```

The build command runs `prisma generate` and `prisma db push` before `next build`, so the database schema is created automatically.

After deployment, open `/rejestracja` and register using exactly the e-mail configured in `ADMIN_EMAIL`. That account will receive the `ADMIN` role and will be redirected to `/admin` after the next login. All other registered accounts receive the `USER` role.

> Do not use the demo passwords from `prisma/seed.ts` in production. The seed file is intended only for local/demo environments and is not run by the production build.
