# SunVolt Solar — Website + Admin Panel

A modern, fully responsive marketing website for a solar company, with a built-in
admin panel for managing all content. Built with **Next.js 16**, **Tailwind CSS**,
**Prisma + Neon Postgres**, and **ImageKit** for images. Deploys to **Vercel**.

## Features

**Public website**
- Home, About Us, Services, Products, Contact pages
- Mobile-first responsive design
- Service & product detail pages
- Floating **WhatsApp** button + floating **Enquiry** chat button (opens a form)
- Enquiry form on every page (stored in the admin — no email needed)
- Basic SEO (per-page titles/descriptions, Open Graph, `sitemap.xml`, `robots.txt`)

**Admin panel** (`/admin`)
- Edit all page text & images
- Add / edit / delete / **drag-to-reorder** / show-hide **Services** and **Products**
- Product specifications editor + featured products
- View, mark read/unread and delete **Enquiries**
- Edit company info, contact details, social links, logo, SEO defaults
- Image uploads to ImageKit (with optimization/CDN)

**Accounts & roles**
- **Super admin** can create multiple **admins** with an auto-generated temporary password
- New admins are **forced to change their password** on first login
- Both admins and the super admin can **change their own password**
- Super admin can reset, disable/enable, or delete admins
- Regular admins **cannot see or access** the super-admin area

## Login

- **Super admin:** `hariharanjeyaramamoorthy@gmail.com` (password set during setup)
- Create additional admins from **Admin → Manage Admins** (super admin only).

## Local development

> Requires **Node.js 20+**.

```bash
npm install
# create your .env from the template and fill in the values
copy .env.example .env     # (Windows)   or   cp .env.example .env
npx prisma db push         # create tables in your database
npm run db:seed            # seed placeholder content + the super admin
npm run dev                # http://localhost:3000
```

Open `http://localhost:3000` for the site and `http://localhost:3000/admin` for the admin.

> **Note (Windows Smart App Control / restricted machines):** the `dev` script uses
> `next dev --webpack` because Turbopack and Tailwind's native engine require native
> binaries that some locked-down Windows machines block. This has no effect on
> production builds (Vercel uses native binaries normally).

## Environment variables

See [`.env.example`](.env.example). Required:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string |
| `AUTH_SECRET` | Random string used to sign the admin login cookie |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint, e.g. `https://ik.imagekit.io/yourid` |
| `SITE_URL` | (optional) Production URL for absolute SEO/sitemap links |

## Deploying to Vercel

1. Push this repo to GitHub (already configured).
2. In **Vercel → New Project**, import the repo.
3. Add the environment variables above in **Settings → Environment Variables**
   (use the same values as your local `.env`, but **without** the `\` escaping — the
   `\$` escaping is only needed in dotenv files, not in the Vercel dashboard).
4. Deploy. The build runs `prisma generate && next build` automatically.
5. Neon is shared between local and production, so the tables and the super-admin
   account already exist. If you point at a fresh database, run `npx prisma db push`
   and `npm run db:seed` against it once.

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 3
- Prisma ORM + Neon Postgres
- ImageKit (image storage + CDN)
- jose (JWT cookie sessions) + bcryptjs
- @dnd-kit (drag-and-drop reordering)

## Project structure

```
app/
  (site)/        Public website pages + layout (header/footer/floating buttons)
  admin/         Admin panel (login, change-password, and (panel) dashboard group)
  api/           Route handlers (enquiries, auth, admins, services, products, ...)
components/      Shared UI + admin UI components
lib/             prisma client, data helpers, auth, imagekit, slug
prisma/          schema.prisma + seed.mjs
middleware.ts    Protects /admin and enforces temp-password changes
```
