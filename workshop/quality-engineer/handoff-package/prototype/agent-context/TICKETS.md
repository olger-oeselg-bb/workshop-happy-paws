# Tickets & Improvement Backlog — Prototype

This file contains user stories (as tickets), indicates which stories were implemented in the prototype, and lists improvement ideas discovered during development.

Legend
- [x] implemented in prototype
- [ ] not implemented / backlog

---

## User stories (priority order)

- [x] US-001: As a shelter staff, I want to add a pet with name, type, breed, age, gender and photo so that they appear in the list for adoption.
  - Implemented: `POST /api/pets` and Add Pet UI under `#/add`.

- [x] US-002: As a shelter worker, I want to view a pet's profile with details and a photo so I can review information before meeting an adopter.
  - Implemented: `GET /api/pets/:id` and profile view in the frontend.

- [x] US-003: As a shelter worker, I want to update a pet's status (In Shelter / Pending Adoption / Adopted / Not Available) so records reflect current adoption state.
  - Implemented: `PATCH /api/pets/:id` and a status selector on the profile page; status badges displayed on the list and profile.

- [x] US-004: As a veterinarian partner, I want to add medical records (notes, vet, date, type) to a pet's profile so medical history is tracked.
  - Implemented: `GET` and `POST` medical records endpoints and UI section on profile.

- [x] US-005: As a shelter worker, I want to search and filter pets by type, breed, age and status to quickly find candidates.
  - Implemented: server-side query filtering (`GET /api/pets` supports q, type, status, breed, minAge, maxAge) and client-side filter controls in the list view.

- [x] US-006: As a QE, I want an API call to reset test data so I can run reproducible tests.
  - Implemented: `POST /api/reset` supports an optional `seed` name (query or JSON body). Available seeds: `default`, `minimal`, `many`.

- [x] US-007: As a volunteer coordinator, I want to upload and manage multiple photos per pet so I can showcase them to adopters.
  - Backlog: only single `photoUrl` is supported; file uploads not implemented.

- [x] US-008: As a shelter admin, I want audit logs for status changes and medical record edits so there's traceability.
  - Backlog: not implemented.

- [x] US-009: As a volunteer, I want to view formatted timestamps and human-friendly dates in the UI so the data is easier to read.
  - Implemented: `formatDate` and `formatRelative` helpers added to `static/app.js`; profile, medical records and audit views now display human-friendly dates.

- [x] US-010: As a veterinarian partner, I want to edit and delete medical records so I can correct or remove outdated information.
  - Implemented: edit/delete operations for medical records with UI confirmation dialogs; inline editing form and delete confirmation.

- [x] US-011: As a user with disabilities, I want accessible UI elements so I can navigate and use the application effectively.
  - Implemented: add `aria-label` and `aria-live` messages for status updates and medical record creation; ensure forms have proper labels and keyboard navigation.

---

## Frontend Refactor Backlog — Vue 3 + Pinia + Vite

- [x] FE-TECH-001: Establish frontend refactor plan
  - Goal: Document phases, risks, dependencies, and rollback strategy for the migration in `FRONTEND_REFACTOR_PLAN.md`.
  - Acceptance criteria: Plan file outlines phased timeline, risk log, rollback steps, and stakeholder sign-off checklist.

- [x] FE-TECH-002: Introduce Vite build environment
  - Goal: Set up a `frontend/` workspace using Vite with dev/build scripts wired into `package.json`.
  - Acceptance criteria: `npm run dev:frontend` serves the app with hot module replacement; Express can serve the production build output.

- [x] FE-TECH-003: Scaffold Pinia stores
  - Goal: Create a central store for pets, filters, active pet details, and UI messages.
  - Acceptance criteria: Store exposes actions for loading pets/profile data and managing medical records while maintaining current functionality.

- [x] FE-TECH-004: Adopt vue-router for navigation
  - Goal: Replace manual hash handling with declarative routes (`/`, `/add`, `/pet/:id`).
  - Acceptance criteria: Router configuration created, navigation guards preserve existing behavior, and deep links load correct views.

- [x] FE-TECH-005: Implement AppShell layout
  - Goal: Provide a top-level layout component housing header, toast region, and router view.
  - Acceptance criteria: `<AppShell>` renders shared chrome with accessible landmarks and consumes Pinia UI state.
  - Vue components should be single-file components storing html, js/ts and scss.

- [x] FE-TECH-006: Extract PetList and Filters components
  - Goal: Break the list view into reusable components backed by store state.
  - Acceptance criteria: `<PetList>` and `<PetFilters>` render pet cards, handle filter changes, and preserve existing accessibility enhancements.

- [x] FE-TECH-007: Create PetCard component
  - Goal: Encapsulate card markup, status badge, and click handling.
  - Acceptance criteria: Component accepts a pet prop, emits select events, and supports keyboard activation with descriptive alt text.

- [x] FE-TECH-008: Isolate AddPetForm component
  - Goal: Move intake form logic into a dedicated component with validation helpers.
  - Acceptance criteria: Component emits `submit` with payload, manages photo uploads, and keeps aria attributes from the legacy form.

- [x] FE-TECH-009: Build PetProfile route module
  - Goal: Compose profile view from child components (status, gallery, medical records, audit log).
  - Acceptance criteria: Route loads data via Pinia actions, handles loading/error states, and reuses shared UI components.

- [x] FE-TECH-010: Implement MedicalRecords module
  - Goal: Create dedicated components/composables for listing and editing medical records.
  - Acceptance criteria: CRUD actions are driven through the store, inline edit form remains accessible, and aria-live announcements persist.

- [x] FE-TECH-011: Implement PhotoGallery and uploader components
  - Goal: Provide reusable gallery/lightbox and upload triggers for pet media.
  - Acceptance criteria: Components support keyboard navigation, expose events for uploads, and display both primary and additional photos.

- [ ] FE-TECH-012: Introduce API service layer
  - Goal: Centralize network calls for pets, medical records, and audit logs.
  - Acceptance criteria: Modules under `src/api/` encapsulate fetch logic with shared error handling.

- [ ] FE-TECH-013: Wire Pinia actions to API layer
  - Goal: Ensure stores delegate HTTP concerns to the new service modules.
  - Acceptance criteria: Stores manage loading/error flags, update state predictably, and expose success/failure events for the UI store.

- [ ] FE-TECH-014: Add UI feedback store
  - Goal: Provide a Pinia store for toast/alert messaging and modal coordination.
  - Acceptance criteria: `<ToastRegion>` consumes the store, supports multiple variants, and replaces legacy `message`/`toast` refs.

- [ ] FE-TECH-015: Post-migration accessibility audit
  - Goal: Validate that the new component architecture maintains or improves accessibility.
  - Acceptance criteria: Documented axe-core (or similar) audit with issues resolved or logged in backlog, including keyboard navigation verification.

- [ ] FE-TECH-016: Retire legacy `static/app.js`
  - Goal: Remove monolithic script once Vite-based app reaches parity.
  - Acceptance criteria: Build artifacts served by Express, legacy file deleted, and rollback instructions noted in docs.

- [ ] FE-TECH-017: Create TypeScript adoption ADR (optional)
  - Goal: Decide whether to adopt TypeScript during refactor.
  - Acceptance criteria: ADR file summarizes decision, trade-offs, and onboarding steps; codebase aligns with chosen direction.

- [ ] FE-TEST-001: Add component unit test coverage
  - Goal: Introduce Vitest + Vue Test Utils for critical components (e.g., PetList, MedicalRecords, StatusSelect).
  - Acceptance criteria: Test suite runs via `npm run test:unit`, covers happy paths and edge cases, and integrates with CI.

- [ ] FE-DOC-001: Update architecture documentation
  - Goal: Reflect new tooling, component structure, and state management approach in `ARCHITECTURE.md`.
  - Acceptance criteria: Document includes component tree diagram, build/deploy steps, and notes on Pinia usage.

- [ ] FE-DOC-002: Capture migration retrospective
  - Goal: Record lessons learned, remaining risks, and follow-up backlog items.
  - Acceptance criteria: Retrospective doc published with wins, challenges, and recommendations for QE handoff.

---

## Improvements & Tech debt (observations during development)

- Improve status selector UX
  - Done (profile select styled) — but consider adding a small transition when badge changes, and make the select keyboard-friendly with clearer focus outline (aria attributes). Priority: low.

- Accessibility
  - See US-011 for accessibility improvements.

- Medical records
  - See US-010 for edit/delete operations.
  - Add validation to ensure `date` uses a consistent format and consider storing ISO timestamps.

- Photo handling
  - Support multiple photos and image upload (multipart) with server-side storage or integration with S3/local uploads for realistic testing.

- Tests
  - See US-012 for expanding Playwright test coverage.
  - Skip adding additional E2E Playwright because this project is input for quality engineers to add those tests.

- Data model
  - Consider switching from file-based lowdb to an in-memory DB for CI tests or to SQLite/Postgres for more realistic concurrency testing.

- Logging & observability
  - Add request logging middleware (`pino-http`) to capture request traces and status codes. Consider adding a development-only request id to help trace failing tests.

- Linting & formatting
  - The project uses ESLint flat config and Prettier; consider adding Husky/pre-commit hooks to keep consistency.

- Concurrency
  - lowdb file writes are not safe for concurrent instances — document this clearly and avoid parallel server runs using same `db.json` in CI.

- Reset & seed data
  - Expand `POST /api/reset` to accept named seeds or dataset fixtures so QEs can quickly run a variety of test scenarios.

---

## Suggested next tickets (for sprint planning)

- TICKET-102: Add edit/delete for medical records and UI confirmation dialogs. (est: 1-2d) — Now US-010
- TICKET-104: Add accessibility improvements and aria attributes for status updates. (est: 1d) — Now US-011
- TICKET-105: Add Playwright tests for status badge color and medical record workflows. (est: 1-2d) — Now US-012


---

Generated: 2025-09-23
