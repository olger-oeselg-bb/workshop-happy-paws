# Happy Paws — Prototype Architecture

This document describes the architecture of the prototype included in this handoff package. It is intentionally small, self-contained and designed for Quality Engineers to run and test quickly.

## High-level overview

- Backend: Node.js + Express running in `server.js`. Responsible for a small REST API and serving both the legacy static frontend and the new Vue build.
- Persistence: lowdb (JSON file) using `db.json` in the prototype folder. Light-weight and file-based for easy reset and inspection.
- Frontend: 
  - **New (Vue 3 + Vite)**: Modern SPA in `frontend/` using Vite build system, Vue 3 SFC components, and Pinia state management. Runs on port 5173 in development with HMR. Production build outputs to `dist/` and is served by Express.
  - **Legacy (Vue 3 CDN)**: Original single-file app in `static/` (no build step). Main logic in `static/app.js`, markup in `static/index.html`, styles in `static/styles.css`. Still functional for reference.
- State Management: Pinia stores (Composition API) for pets data and UI feedback (toasts, modals).
- Build System: Vite 6.4+ with Vue plugin, HMR, and API proxy to backend during development.
- Logging: pino is used (module `src/logger.js`) with pretty-print transport in development.
- Tests: a Playwright E2E test is included under `tests/` (minimal, intended as an example for QEs to extend).
- Lint/format: ESLint (flat config) + Prettier are configured for fast developer feedback.

## File layout (important files)

- `server.js` — app entry. Initializes the DB, mounts router at `/api`, serves `dist/` (Vue build) if available, otherwise falls back to `static/` (legacy).
- `vite.config.mjs` — Vite configuration with Vue plugin, path aliases, API proxy to backend (port 3000), and build output to `dist/`.
- `src/db.js` — lowdb wrapper and helper functions (initDb, getPets, getPet, addPet, updatePet, getMedicalRecords, addMedicalRecord, resetDb).
- `src/router.js` — Express router exposing the REST API under `/api` (GET /pets, GET /pets/:id, POST /pets, PATCH /pets/:id, POST /reset, GET /pets/:id/medical-records, POST /pets/:id/medical-records).
- `src/logger.js` — pino logger configuration.
- `db.json` — runtime data file (persistent between runs); can be reset via the API `POST /api/reset`.
- `frontend/` — Modern Vue 3 + Vite frontend:
  - `index.html` — HTML entry point for Vite build.
  - `src/main.js` — Vue app initialization with Pinia plugin.
  - `src/App.vue` — Root component with store demos and toast UI.
  - `src/stores/` — Pinia stores:
    - `pets.js` — Pet data management (state, getters, actions for CRUD, filtering).
    - `ui.js` — UI feedback (toast notifications, modal management, global loading).
    - `index.js` — Barrel export for stores.
- `static/` — Legacy frontend assets (Vue 3 CDN):
  - `index.html` — HTML shell that loads Vue from CDN and `static/app.js`.
  - `app.js` — small Vue app with a hash-based router and views: list, add, profile.
  - `styles.css` — styles including status badges and select styles.
- `dist/` — Production build output from Vite (git-ignored, created by `npm run build:frontend`).
- `tests/` — Playwright tests (example E2E).
- `package.json` — scripts for `start`, `dev:frontend`, `build:frontend`, `lint`, `test` and project dependencies.

## API contract (summary)

All API paths are mounted under `/api`.

- GET /api/pets
  - Response: 200 OK — JSON array of Pet objects.

- POST /api/pets
  - Request: JSON Pet (name, type, breed, age, gender, status, photoUrl)
  - Response: 201 Created — created Pet with id and createdAt
  - Validation: name, type, photoUrl required (prototype-side validation in the frontend and server-side sanity checks)

- GET /api/pets/:id
  - Response: 200 OK — Pet object, or 404 if not found

- PATCH /api/pets/:id
  - Request: partial Pet object (prototype uses { status })
  - Response: 200 OK — updated Pet

- GET /api/pets/:id/medical-records
  - Response: 200 OK — JSON array of medical records for the pet

- POST /api/pets/:id/medical-records
  - Request: medical record JSON (notes, vet, date, type)
  - Response: 201 Created — saved record with id and createdAt

- POST /api/reset
  - Request: none
  - Response: 200 OK — resets `db.json` to a small seeded dataset (used in tests and QE workflows)
  - Seed support: POST /api/reset accepts an optional `seed` name in the query or JSON body (for example `?seed=default` or `{ "seed": "many" }`) to load predefined fixtures.


### Data shapes (simplified)

Pet
- id: number
- name: string
- type: string
- breed: string
- age: string|number
- gender: string
- status: string ("In Shelter" | "Pending Adoption" | "Adopted" | "Not Available")
- photoUrl: string
- createdAt: ISO timestamp string

MedicalRecord
- id: number
- petId: number
- notes: string
- vet: string
- date: string (YYYY-MM-DD preferred)
- type: string
- createdAt: ISO timestamp string


## Design decisions & trade-offs

- lowdb (JSON) was chosen for simplicity. It keeps the prototype runnable without installing or configuring a database; it is easy for QEs to inspect and reset data. It is not suitable for production concurrency.
- **Dual frontend approach**: The legacy Vue 3 CDN app (`static/`) remains for reference, while the new Vite-based frontend (`frontend/`) represents the modern architecture. Express serves the Vite build (`dist/`) when available, falling back to `static/` otherwise.
- **Vite build system**: Provides fast HMR during development, optimized production builds, and a better developer experience with ES modules, SFC components, and proper tooling. The dev server runs on port 5173 and proxies API requests to the Express backend on port 3000.
- **Pinia for state management**: Uses the Composition API pattern for stores, providing reactive state, computed getters, and actions. The pets store handles data operations while the UI store manages cross-cutting concerns like toasts and modals.
- **Hybrid module system**: Backend uses CommonJS (`require`/`module.exports`) for compatibility, while the Vite frontend uses ES modules (`import`/`export`). Configuration files like `vite.config.mjs` use `.mjs` extension to enable ES modules without affecting the backend.
- No authentication or authorization is implemented — the prototype is intended for testing features and flows, not for production security.
- The legacy UI uses a simple hash-based router (`location.hash`) for predictable navigation. The new Vite frontend will adopt Vue Router in a future phase.


## Running locally (quick)

From the prototype folder:

```bash
cd workshop/quality-engineer/handoff-package/prototype
npm install  # first time only

# Production mode (serves Vite build from dist/)
npm start
# Open http://localhost:3000

# Development mode with HMR (recommended for active development)
npm run dev:frontend  # Terminal 1 - Vite dev server on port 5173
npm start             # Terminal 2 - Express API server on port 3000
# Open http://localhost:5173
```

Helpful scripts:
- `npm run dev:frontend` — start Vite dev server with HMR on port 5173
- `npm run build:frontend` — build production bundle to `dist/`
- `npm start` — start Express server (serves `dist/` if available, otherwise `static/`)
- `npm run lint` — run ESLint
- `npm test` — run Playwright tests (requires Playwright dependencies; see package.json)


## Error modes and edge cases

- lowdb is file-based: concurrent writes from multiple processes may corrupt the file. Avoid running multiple server instances against the same `db.json`.
- The prototype performs minimal validation. Expect the API to return 4xx for simple malformed input, but some invariants are enforced only in the frontend.
- Medical records and counters are initialized defensively in `src/db.js` to avoid runtime errors when data is missing.


## How to extend

- Adding endpoints: update `src/router.js` and call db helpers from `src/db.js`.
- Adding Vue components: create `.vue` files in `frontend/src/components/` and import into parent components.
- Adding Pinia stores: create new store files in `frontend/src/stores/` following the Composition API pattern (see `pets.js` and `ui.js` examples).
- Adding fields: update the frontend components/stores and the DB helpers to persist the new fields.
- Adding tests: add Playwright tests under `tests/` and use `npm test`.
- Replacing lowdb: implement a new DB layer in `src/db.js` that follows the existing helper function names (initDb, getPets, addPet...) and swap to a real DB connection.


## Notes for QEs

- Use `POST /api/reset` to reset the dataset before a test run.
- `db.json` can be inspected to verify persisted records.
- Playwright tests in `tests/` are intentionally minimal — add tests that reflect real QA workflows: create pet, change status, add medical record, and verify persistence.
- The Vite dev server (port 5173) is recommended for testing during active development due to HMR. Production builds should be tested via `npm start` (port 3000) after running `npm run build:frontend`.
- Both frontend versions (legacy `static/` and new `frontend/`) share the same Express API, so backend testing remains consistent.


## Contacts & provenance

This prototype was produced from Business Analyst interview artifacts (user stories and wireframes) as part of the workshop materials. See `workshop/` for the BA artifacts and `workshop/quality-engineer/handoff-package/` for handoff docs.


---
Generated on: 2025-09-23

