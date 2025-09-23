```markdown
# SE → QE Handoff (MVP)

This package provides a small runnable MVP prototype and the information Quality Engineers need to start writing end-to-end tests quickly.

What you'll find here
- A tiny prototype app (Vue via CDN + Node/Express) under `prototype/`.
- A Playwright test that exercises the Pet Intake flow: `prototype/tests/e2e.spec.js`.
- A fast README with commands to run the app and the tests.

Design decisions
- Stack: Vue (frontend via CDN for speed), Node.js + Express backend (in-memory data), Playwright (recommended) for E2E tests.
- The prototype implements a small subset of the API and UI: list pets, add pet (photo URL allowed), view list update. This is sufficient for QE to start authoring E2E tests mapped to acceptance criteria.

Notes for QEs
- This is intentionally minimal and uses an in-memory store (no DB). That keeps setup trivial. Tests should reset or run against a dedicated local instance.
- You may prefer Cypress or another E2E tool. The provided Playwright test is a reference; feel free to port it.

Where to start
1. cd `workshop/quality-engineer/handoff-package/prototype`
2. npm install
3. npm run start
4. open http://localhost:3000 in a browser to explore the UI
5. In another terminal: npm run test (see README for Playwright browser install step)

If you'd like, I can add additional tests (status change, adoption flow, medical-records) or port the tests to another framework.

```
