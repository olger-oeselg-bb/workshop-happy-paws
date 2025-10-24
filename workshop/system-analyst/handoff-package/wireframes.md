# Wireframes & UI Specs — Software Engineer Handoff

These low-fidelity wireframes translate the user stories into concrete screens, components, and interactions. Each screen below includes: purpose, desktop + mobile layout notes, fields/components, validations and microcopy, states (success/error), mapping to acceptance criteria, and a suggested minimal API contract.

## Global notes
- Mobile-first, responsive layout (single column mobile, 2-column or card grid desktop).
- Colors/icons: use clear status colors (green = In Shelter/Available, orange = Foster, gray = Adopted, red = Medical Hold).
- Photo handling: client uploads image to backend which stores in file store; UI shows thumbnail immediately (client-side preview).
- Auth: basic staff/admin auth required for intake, status change, medical records. Public read-only endpoints for pet list and profiles.

---

## Screen: Pet Intake Form (Staff)
Purpose: Register new pets quickly with required details and photo.

Desktop layout
- Two-column form: left column fields, right column photo upload + status preview.

Mobile layout
- Single column stacked fields with photo upload at top.

Fields / Components
- Photo Upload (required) — drag/drop or camera on mobile; preview thumbnail.
- Name (text, required)
- Type (select: Dog, Cat, Other; required)
- Breed (text)
- Age or DOB (either Age number + units or date picker; required one)
- Gender (radio: Male, Female, Unknown)
- Status (select: default = In Shelter)
- Short Description / Notes (textarea)
- Buttons: Save (primary), Cancel (secondary)

Validation & Microcopy
- Photo: "Please upload a clear photo of the pet. Required."
- Required fields inline validation on blur and on submit.
- On save: show progress indicator; on success, navigate to the new pet profile and show toast "Pet created".

States
- Loading (saving...), success (navigate to profile), error (show field-level messages or global error banner).

Acceptance mapping
- Meets Marko's intake story acceptance criteria: required fields + photo; after save pet appears in list and profile opens.

Suggested API
- POST /api/pets
  - body: { name, type, breed, age, dob, gender, status, description, photoUrl }
  - response: 201 { id, ...pet }

---

## Screen: Pet Profile Page (Public + Staff)
Purpose: Show pet details, photo, status, adoption info, and medical history.

Desktop layout
- Left: large photo. Right: details card (name, type, breed, age/DOB, gender, status, actions). Below: tabs for Description, Medical History, Adoption.

Mobile layout
- Photo full-width top, details card below, tabs stacked.

Components & Actions
- Status badge and dropdown (staff only) for quick status change.
- Buttons: Apply to Adopt (public), Add Medical Record (staff), Edit Pet (staff)
- Medical History: chronological list with date, type, notes; Add entry opens inline modal or slide-over.
- Adoption block: shows pending applications count and approved record if adopted.

Validation & States
- If status changed to Adopted by staff, create adoption record and update UI immediately.
- If public user tries Apply when status != In Shelter, show: "This pet is not available for adoption." and disable form.

Acceptance mapping
- Covers Marko status update story, Sofia adopter story, and Dr. Karl medical history story.

Suggested APIs
- GET /api/pets/{id} -> {pet, medicalRecords[], adoptionRecords[]}
- PATCH /api/pets/{id} -> {status, other editable fields}
- POST /api/pets/{id}/medical-records -> {date, type, notes, nextDue}

---

## Screen: Pet List / Dashboard (Staff & Public variations)
Purpose: Browse pets, filter/search, quick status visibility; staff dashboard adds counts and upcoming medical events.

Desktop layout
- Grid of cards (photo, name, type, status badge, short description). Left sidebar filters (type, status, age range) and search.

Mobile layout
- List or single-column cards with filter button opening a modal.

Components
- Quick actions on each card (staff): change status, view profile, open intake.
- Dashboard summary (staff only): top bar with 4 KPI cards: Total pets, Available, Pending applications, Upcoming medical events (30d).

States
- Filters update UI immediately; status badges colored; empty states show CTA to add pet (staff) or message (public).

Acceptance mapping
- Satisfies Anna's and Leena's needs for list/status visibility and small dashboard counts.

Suggested APIs
- GET /api/pets?status=In%20Shelter&type=Dog&search=...&page=1
- GET /api/dashboard (staff) -> {totalPets, byStatus:{}, pendingApplications, upcomingMedicalEvents}

---

## Screen: Adoption Application (Public) and Review (Staff)
Purpose: Allow adopters to apply, and staff to review/approve/reject applications.

Adopter-facing form (public)
- Fields: Adopter name (required), contact email (required), phone (optional), reason for adoption (required), optional comments.
- Microcopy: "Submitting an application creates a pending request; shelter staff will review and respond."
- On submit: create application, show confirmation and expected response time.

Staff review UI
- List of pending applications (linked to pet and adopter info), with actions: Approve, Reject, Add note.
- Approve flow: sets application status to Approved, records staff user and timestamp, then sets pet.status = Adopted and generates adoption record placeholder.

Acceptance mapping
- Meets Marko and Sofia stories: application fields, staff approval/rejection, automatic pet status change on approval.

Suggested APIs
- POST /api/pets/{id}/applications -> { adopterName, contactEmail, phone, reason }
- GET /api/applications?status=pending
- PATCH /api/applications/{id} -> { status: 'approved'|'rejected', staffUserId, note }

---

## Component: Medical History Modal / Section
Purpose: Add and view medical entries tied to a pet.

Fields
- Date (required), Treatment type (select: Vaccination, Check-up, Treatment, Other), Notes (textarea), Next-due (optional date)

Interactions
- Add entry inline or modal; on save append to top of medical history list; show success toast.
- If next-due present and within 30 days, add to dashboard upcoming events.

Acceptance mapping
- Matches Dr. Karl's requirements for medical history and optional next-due reminders.

Suggested API
- POST /api/pets/{id}/medical-records
- GET /api/pets/{id}/medical-records

---

## Accessibility & UX details
- All actionable controls must be keyboard-accessible and ARIA-labeled.
- Forms should use semantic HTML; error messages associated with inputs.
- Images need alt text (pet name + brief description).

## Data model (quick reference)
- Pet: { id, name, type, breed, dob, age, gender, status, photoUrl, description, createdAt, updatedAt }
- MedicalRecord: { id, petId, date, type, notes, nextDue, createdBy, createdAt }
- AdoptionApplication: { id, petId, adopterName, contactEmail, phone, reason, status, staffUserId, createdAt }

## Mapping to user stories
- Pet Intake Form -> Marko: Pet intake user story (High priority)
- Pet Profile + Status dropdown -> Marko / Leena / Sofia (High/Medium)
- Adoption Application + Staff Review -> Sofia / Marko (High)
- Medical History -> Dr. Karl (High)
- Dashboard KPIs & Exports -> Anna (Medium/Low)

---

## Next steps (suggested for SEs)
1. Implement the core data model and API endpoints (Pet, Applications, MedicalRecords).
2. Build Pet Intake form and Pet List with responsive layout; add photo upload flow.
3. Implement Pet Profile with tabs and staff status actions.
4. Implement Adoption Application flow and staff review with automatic status update.
5. Add Medical Records and surface upcoming events on a basic dashboard.

If you'd like, I can turn each screen into a GitHub issue template with acceptance criteria and suggested subtasks, or scaffold a small React + Express prototype implementing the Pet Intake and Pet Profile screens.
