# ZZ Denik

Mobile-first character sheet and campaign helper for the Forbidden Lands / Zapovezene zeme tabletop RPG.

![Version](https://img.shields.io/badge/version-1.8.3-blue.svg)
![Stack](https://img.shields.io/badge/React%20%2B%20Vite%20%2B%20Capacitor-Android-green.svg)

## Current Highlights

- Character sheet with attributes, skills, willpower, experience, conditions, critical injuries, notes, mounts, and relationships.
- Large mobile steppers for attributes, resources, and other frequently changed values.
- Bottom navigation for Denik, Zbozi, Talenty, and Kouzla across mobile and desktop layouts.
- Inventory and equipment flow for buying, equipping, unequipping to backpack, or dropping weapons and armor.
- Encumbrance tracking, including the Soumar talent bonus.
- Zbozi catalog with grouped tabs, accordion item cards, contextual filters, cart, and Koupit & Vybavit actions.
- Talent catalog split into general talents and profession paths; every talent containing `Cesta` is treated as a profession talent.
- Spell catalog for browsing and learning spells.
- Character creation wizard with homebrew-aware setup flow.
- Import/export modal for single characters and full backups, optimized for mobile WebView safe areas.
- Rules reference modal with quick combat, condition, journey, and skill lookup.
- Local backend catalog API with DOCX import, Google Docs/Drive sync, import history, warnings, and diff summaries.
- Android APK build through Capacitor.

## Tech Stack

- React 18 and Vite
- Tailwind CSS
- Lucide React icons
- Capacitor Android/iOS wrapper
- Node.js backend utilities for DOCX catalog import and Google source sync
- Mammoth and Cheerio for document parsing

## Repository Layout

- `zz-denik/src/` - React application source.
- `zz-denik/src/components/` - Character sheet, modals, layout, catalog, spell, and talent components.
- `zz-denik/src/data/` - Bundled static fallback catalog data.
- `zz-denik/backend/` - Local catalog import, sync, API server, history, and source config.
- `zz-denik/docs/` - Backend implementation notes and import plan.
- `zz-denik/import_files/` - Local source documents used during development.
- `zz-denik/android/` - Capacitor Android project.
- `zz-denik/dist/` - Generated Vite web build.

## Development

Install dependencies:

```bash
cd zz-denik
npm install
```

Run the frontend:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

Run the local backend:

```bash
npm run backend:dev
```

The Vite dev server proxies `/api` to `http://localhost:8787`.

## Catalog Import

Import local DOCX sources into generated catalog data:

```bash
npm run catalog:import
```

Sync configured Google Docs/Drive sources and import them:

```bash
npm run catalog:sync-google
```

The backend exposes:

- `GET /api/catalog/bootstrap`
- `GET /api/catalog/history`
- `POST /api/admin/import`
- `POST /api/admin/sync-google`

## Android APK

Build the web app and sync Capacitor:

```bash
cd zz-denik
npm run build
npx cap sync android
```

Build a debug APK:

```bash
cd android
.\gradlew.bat assembleDebug
```

The generated APK is copied at release time to the repository root using the format:

```text
FL_1.8.3.apk
```

## Version

Current app version: `1.8.3`

Version is tracked in:

- `zz-denik/package.json`
- `zz-denik/android/app/build.gradle`
- `zz-denik/CHANGELOG.md`
- `README.md`

## License

This project is licensed under the MIT License.

## Acknowledgments

Based on the Forbidden Lands RPG system by Free League Publishing, with homebrew Zapovezene zeme content and automation for local campaign data.
