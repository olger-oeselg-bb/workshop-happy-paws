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

- [ ] US-012: As a QE, I want automated tests for key workflows so I can ensure quality and catch regressions.
  - Backlog: expand Playwright test coverage for status changes (verify badge color), medical record add/edit/delete, and reset endpoint consistency.

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
