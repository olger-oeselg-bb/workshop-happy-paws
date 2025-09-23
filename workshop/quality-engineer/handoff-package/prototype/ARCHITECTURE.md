# Happy Paws — Prototype Architecture

This document describes the architecture of the prototype included in this handoff package. It is intentionally small, self-contained and designed for Quality Engineers to run and test quickly.

## High-level overview

- Backend: Node.js + Express running in `server.js`. Responsible for a small REST API and serving the static frontend.
- Persistence: lowdb (JSON file) using `db.json` in the prototype folder. Light-weight and file-based for easy reset and inspection.
- Frontend: Vue 3 (CDN) single-file SPA-like app in `static/` (no build step). Main logic in `static/app.js`, markup in `static/index.html`, styles in `static/styles.css`.
- Logging: pino is used (module `src/logger.js`) with pretty-print transport in development.
- Tests: a Playwright E2E test is included under `tests/` (minimal, intended as an example for QEs to extend).
- Lint/format: ESLint (flat config) + Prettier are configured for fast developer feedback.

## File layout (important files)

- `server.js` — app entry. Initializes the DB, mounts router at `/api`, serves `static/` folder.
- `src/db.js` — lowdb wrapper and helper functions (initDb, getPets, getPet, addPet, updatePet, getMedicalRecords, addMedicalRecord, resetDb).
- `src/router.js` — Express router exposing the REST API under `/api` (GET /pets, GET /pets/:id, POST /pets, PATCH /pets/:id, POST /reset, GET /pets/:id/medical-records, POST /pets/:id/medical-records).
- `src/logger.js` — pino logger configuration.
- `db.json` — runtime data file (persistent between runs); can be reset via the API `POST /api/reset`.
- `static/` — frontend assets:
  - `index.html` — HTML shell that loads Vue from CDN and `static/app.js`.
  - `app.js` — small Vue app with a hash-based router and views: list, add, profile.
  - `styles.css` — styles including status badges and select styles.
- `tests/` — Playwright tests (example E2E).
- `package.json` — scripts for `start`, `lint`, `test` and project dependencies.

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
- Vue via CDN removes build complexity and allows rapid iteration. This keeps the prototype runnable with only Node/npm installed.
- No authentication or authorization is implemented — the prototype is intended for testing features and flows, not for production security.
- The UI uses a simple hash-based router (`location.hash`) for predictable navigation in static assets served by Express.


## Running locally (quick)

From the prototype folder:

```bash
cd workshop/quality-engineer/handoff-package/prototype
npm install  # first time only
npm start
```
Open http://localhost:3000

Helpful scripts:
- `npm run lint` — run ESLint
- `npm test` — run Playwright tests (requires Playwright dependencies; see package.json)


## Error modes and edge cases

- lowdb is file-based: concurrent writes from multiple processes may corrupt the file. Avoid running multiple server instances against the same `db.json`.
- The prototype performs minimal validation. Expect the API to return 4xx for simple malformed input, but some invariants are enforced only in the frontend.
- Medical records and counters are initialized defensively in `src/db.js` to avoid runtime errors when data is missing.


## How to extend

- Adding endpoints: update `src/router.js` and call db helpers from `src/db.js`.
- Adding fields: update the frontend `static/app.js` forms and the DB helpers to persist the new fields.
- Adding tests: add Playwright tests under `tests/` and use `npm test`.
- Replacing lowdb: implement a new DB layer in `src/db.js` that follows the existing helper function names (initDb, getPets, addPet...) and swap to a real DB connection.


## Notes for QEs

- Use `POST /api/reset` to reset the dataset before a test run.
- `db.json` can be inspected to verify persisted records.
- Playwright tests in `tests/` are intentionally minimal — add tests that reflect real QA workflows: create pet, change status, add medical record, and verify persistence.


## Contacts & provenance

This prototype was produced from Business Analyst interview artifacts (user stories and wireframes) as part of the workshop materials. See `workshop/` for the BA artifacts and `workshop/quality-engineer/handoff-package/` for handoff docs.


---
Generated on: 2025-09-23

