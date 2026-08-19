# Wedding Website

A wedding website with photo challenge functionality.

## Quick Start (Development)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker Deployment

```bash
docker compose up -d --build
```

## Customization

### Theme Colors
Edit `src/config/theme.ts` to change colors, fonts, and wedding details.

### Images
Place images in `public/images/` and reference them in `src/config/images.ts`.

### Challenges
Add or modify challenges in `src/config/challenges.ts`. Each challenge is a reusable card widget.

### Translations
Edit `src/config/i18n.ts` for German and English text.

### Wedding Details
Change names, date, and venue in `src/config/theme.ts` under the `wedding` key.

## Architecture

- **Next.js 16** (App Router) with TypeScript and Tailwind CSS
- **SQLite** via better-sqlite3 for guest and photo metadata
- **File system** storage for uploaded photos (Docker volume)
- **i18n** via React Context (DE/EN toggle)
- **Mobile-first** responsive design

## Data Locations (Docker)

- Database: `/data/wedding.db` (persistent volume)
- Uploaded photos: `/data/uploads/` (persistent volume)
- Access admin panel: `/admin`