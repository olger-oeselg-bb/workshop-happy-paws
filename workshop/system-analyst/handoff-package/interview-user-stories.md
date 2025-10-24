# Interview-driven User Stories — Software Engineer Handoff

This file converts the raw stakeholder interviews (BA package) into concrete user stories and acceptance criteria for the Software Engineer role. Each section below corresponds to a stakeholder interview and lists 1–4 user stories with acceptance criteria, priority, and suggested mapping to the MVP backlog.

## 1) Anna — Shelter Director

- User story: As a shelter director, I want a dashboard that shows shelter metrics (total pets, available for adoption, pending applications, upcoming medical events), so I can make quick operational decisions.
  - Acceptance criteria:
    - Dashboard shows counts for: total pets, pets by status (In Shelter, Foster, Adopted, Medical Hold), pending adoption applications, and medical events in the next 30 days.
    - Data updates within 5 seconds after changes (or on refresh).
    - Dashboard is accessible from desktop and mobile widths.
  - Priority: Medium (valuable for ops; can be implemented after core registry features)
  - MVP mapping: Dashboard view (deferred until basic intake, status, adoption, medical records are implemented).

- User story: As a shelter director, I want simple exportable reports (CSV) for regulatory and funding needs, so I can share them with stakeholders.
  - Acceptance criteria:
    - Export button for pet list and adoption records to CSV.
    - Exports respect applied filters (date range / status).
  - Priority: Low (post-MVP)

## 2) Marko — Shelter Worker

- User story: As a shelter worker, I want to register a new pet quickly with required fields and a photo, so the pet appears in the system and can be managed.
  - Acceptance criteria:
    - Pet intake form requires: name, type (dog/cat), breed, age (or date of birth), gender, status (default: In Shelter), and a photo.
    - Form validation prevents submission if required fields or photo missing.
    - After successful save, the new pet appears in the pet list and its profile page opens.
  - Priority: High
  - MVP mapping: Pet Intake & Profile Management (implement first)

- User story: As a shelter worker, I want to update a pet's status from a single UI (profile or list), so staff and volunteers know the pet's availability.
  - Acceptance criteria:
    - Status dropdown or quick action exists on pet list and profile.
    - Allowed statuses: In Shelter, Foster, Adopted, Medical Hold — exactly one active status.
    - Status change updates the profile immediately and the pet list filters accordingly.
  - Priority: High
  - MVP mapping: Pet Status Updates (implement early)

- User story: As a shelter worker, I want an adoption workflow that records applications and allows staff to approve/reject them, so the adoption process is auditable.
  - Acceptance criteria:
    - Adoption application form captures adopter name, contact info, and reason for adoption.
    - Staff UI allows marking an application as Approved or Rejected with a timestamp and staff user recorded.
    - When approved, the pet status automatically becomes Adopted and an adoption record is created.
  - Priority: High
  - MVP mapping: Adoption Workflow (implement as part of core)

## 3) Leena — Volunteer Coordinator

- User story: As a volunteer coordinator, I want an up-to-date list of pets and their statuses on mobile, so I can assign volunteers and avoid duplicating tasks.
  - Acceptance criteria:
    - Pet list is filterable by status and type and adapts to mobile screens.
    - Status changes reflect immediately in list views used by volunteers.
  - Priority: Medium
  - MVP mapping: Dashboard / List view improvements (MVP: basic filter + responsive list)

- User story: As a volunteer coordinator, I want status-based alerts or simple icons in the list (e.g., Medical Hold), so volunteers don’t book visits inappropriately.
  - Acceptance criteria:
    - Status displayed as clear label and optional color/icon in lists and profiles.
    - Filter and search respect status label.
  - Priority: Medium

## 4) Sofia — Adopter

- User story: As an adopter, I want to see detailed pet profiles (photo, description, medical history, status) and apply online, so I can request adoption without visiting the shelter first.
  - Acceptance criteria:
    - Public-facing pet profile includes photo, basic details, status, and medical history summary.
    - Adoption application form captures required adopter fields and creates a pending application visible to staff.
    - If pet status is not In Shelter (e.g., Adopted), application is blocked with a clear message.
  - Priority: High (adopter UX impacts adoption rate)
  - MVP mapping: Pet Profile + Adoption Application (implement alongside intake and status)

## 5) Dr. Karl — Veterinarian Partner

- User story: As a vet partner, I want a centralized medical history for each pet with add/view capabilities, so vaccination and treatment records are available to the care team.
  - Acceptance criteria:
    - Pet profile includes a Medical History section listing records with date, treatment type (vaccination, check-up, other), and notes.
    - Staff users can add new medical entries with required fields (date, type) and optional notes.
    - Medical history entries are ordered by date (newest first) and are visible on the pet profile.
  - Priority: High (medical records are critical for safe adoptions and partner workflows)
  - MVP mapping: Basic Medical Records (implement early)

- User story: As a vet partner, I want vaccination reminders/next-due dates surfaced, so the shelter can prioritize follow-up care.
  - Acceptance criteria:
    - Medical entries can optionally include next-due date for recurring vaccinations.
    - Dashboard or pet list can highlight upcoming medical events (deferred: may appear as a simple list in MVP)
  - Priority: Low-to-Medium (nice-to-have in MVP)

## 6) Tarmo — IT Consultant

- User story: As an IT advisor, I want the system to be cloud-hostable, mobile-friendly, and GDPR-aware, so the shelter can run it securely and scale affordably.
  - Acceptance criteria:
    - Basic architecture notes: stateless web backend (REST/GraphQL), Database (e.g., PostgreSQL, MongoDB), file store for photos (S3 or compatible), TLS for transport.
    - Configurable data retention/consent flags for adopter contact info (implementation note — expose as configuration/setting; full GDPR workflow may be out-of-scope for MVP).
  - Priority: Architectural (must be respected by SEs when choosing stack)
  - MVP mapping: Non-functional requirements (security, hosting, mobile-first)

## Implementation guidance (quick)
- Start with core data models: Pet, AdoptionApplication, MedicalRecord, Adopter (or embedded adopter data on application).
- Prioritize: Pet intake → Pet profile & photo → Status management → Adoption application → Medical records → Basic dashboard/list filters.
- Keep APIs and UI simple and testable; provide feature flags or configuration for non-MVP items (exports, advanced reporting, GDPR flows).

---

Files referenced: BA interview transcripts in `workshop/business-analyst/interviews/` and the BA MVP `mvp-scope.md`.
