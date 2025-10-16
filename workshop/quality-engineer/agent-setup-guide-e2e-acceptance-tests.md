# QA Coding Agent Setup Guide (E2E Acceptance)

> **Goal:**  
> Equip a coding agent (Copilot/Codex/LLM) to implement end-to-end acceptance tests from your handover materials.  
> *Inputs already available*: user stories per stakeholder, MVP scope, text-based wireframes.  
> *This guide adds QE-specific context, documents, and prompts* so the agent can produce robust, maintainable E2E suites.

---

## 1) What QE must generate (documents the agent needs)

Create these lightweight docs (Markdown/text). Keep them short, precise, and structured. You should cover the following in the docs:

### 1.1 Test Strategy (high level)

- **Test levels**: unit, integration, **E2E acceptance (this guide)**, contract, security, performance, accessibility.
- **Automation focus**: what *must* be automated E2E vs. covered elsewhere.
- **Pyramid & scope rules**: avoid testing business logic through UI when contract or integration test suffices.

### 1.2 Acceptance Criteria Pack

- **Per user story**: clear acceptance criteria expressed as concise bullets or Gherkin (Given/When/Then).
- **Happy path + critical negatives + edge cases.**
- **Traceability ID**: US-12-AC-3 etc., to map tests ↔ stories.

### 1.3 E2E Test Plan (execution model)

- **Critical paths**: list end-to-end flows (e.g., *Register → Login → Submit Application → View Status*).
- **Risk-based prioritization**: P0 (must), P1 (should), P2 (nice).
- **Browser/device matrix or client matrix**: minimal set (e.g., Chromium + one mobile viewport).
- **Data strategy**: seeds, synthetic personas, cleanup/reset policy.
- **Environments**: base URLs, auth bootstrapping, feature flags.
- **Flake policy**: retries, timeouts, quarantine tags.

### 1.4 Oracles & Fixtures

- **Golden data**: canonical inputs/outputs, currency/locale/timezone examples.
- **Determinism notes**: clock control, random seeds, network stubbing policy.
- **Permissions matrix**: roles/rights for each stakeholder (e.g., Customer, Officer, Admin).

### 1.5 Observability & Quality Signals

- **Expected logs/metrics/traces** emitted per critical step (IDs/labels to assert).
- **Error taxonomy**: which errors are user-visible vs. logged only.
- **Alert ties**: what broke if a test fails (metric names helpful).

### 1.6 Security & Compliance Addendum

- **AuthN/Z flows**: tokens, scopes; how tests obtain them safely.
- **PII rules**: masking in screenshots/logs; data retention for artifacts.
- **Audit expectations**: actions that must appear in audit log.

### 1.7 Non-Functional Acceptance (thin slice)

- **Performance smoke**: thresholds (e.g., p95 < 200 ms for key page/API).
- **Accessibility smoke**: WCAG checks (key pages/components).
- **Internationalization**: at least one alt locale/timezone case.

### 1.8 CI/CD & Reporting

- **When to run**: on PR (smoke subset), nightly (full), pre-release (gates).
- **Artifacts**: HTML report, JUnit XML, screenshots, videos, traces.
- **Flake tracking**: tagging, quarantine list, auto-retriable rules.

---

## 2) Suggested repo structure for QA

``` text
project/
└── tests/
    ├── e2e/
    │   ├── specs/
    │   ├── pages/              # Page Objects / Screen Models
    │   ├── fixtures/           # Seed data, persona JSON, mocks
    │   ├── helpers/            # auth, clock, network stubs
    │   ├── config/             # env selector, timeouts, retries
    │   └── reports/            # outputs in CI
└── docs/
    ├── qa-test-strategy.md
    ├── qa-acceptance-criteria.md
    ├── qa-e2e-test-plan.md
    ├── qa-oracles-fixtures.md
    ├── qa-observability.md
    ├── qa-security-compliance.md
    └── qa-ci.md

```

---

## 3) Minimal content for each QA doc (templates)

### 3.1 `qa-test-strategy.md`

- **Levels & scope**: table listing each level, tools, purpose.
- **UI vs. API rule**: “Prefer API/contract unless user value is UI-specific.”
- **Risk classes**: P0 auth/payments, P1 CRUD basics, P2 cosmetics.

### 3.2 `qa-acceptance-criteria.md` (sample)

> Check out alternative syntaxes for AC from [alternative-syntaxes-for-AC-examples.md](./alternative-syntaxes-for-AC-examples.md)

```gherkin
Feature: Loan application submission

Scenario: Happy path submission
  Given a verified Customer exists
  And I am logged in as Customer
  When I submit a loan application with valid fields
  Then I see a confirmation with an application ID
  And an audit log entry exists for "APPLICATION_SUBMITTED"

Scenario: Validation on missing amount
  Given I am on the Loan Application page
  When I submit without "amount"
  Then I see an inline error "Amount is required"
  And the form is not submitted
```

### 3.3 `qa-e2e-test-plan.md` 

- **Flows**: numbered list (with IDs mapping to user stories).
- **Matrix**: browsers/viewports/locales (keep minimal but meaningful).
- **Data reset**: script/command; idempotent seeds.
- **Flake policy**: retries=2 on CI, slowMo local; network idle strategy.

### 3.4 `qa-oracles-fixtures.md`

- **Personas**: `customer_basic`, `officer_admin`.
- **Golden values**: sample application payloads + expected states.
- **Time control**: freeze to `2025-01-15T12:00:00+02:00` for determinism.
- **Network**: which calls to stub vs. hit (and why).

### 3.5 `qa-observability.md`

- **Logs**: required lines (JSON keys), correlation ID propagation.
- **Metrics**: `loan_apply_requests_total`, `loan_apply_latency_ms`.
- **Traces**: span names (`ui.submit`, `api.createLoan`, `db.insert`).

### 3.6 `qa-security-compliance.md`

- **Secrets**: env placeholders only; never commit real tokens.
- **PII**: mask screenshots; redact logs via helper.
- **Audit**: which actions must appear and how to assert.

### 3.7 `qa-ci.md`

- **Pipelines**: PR = smoke; nightly = full; release = full + perf smoke.
- **Artifacts**: where reports are stored; retention policy.
- **Fail gates**: fail PR if smoke fails or critical a11y violations.

---

## 4) What to give the coding agent (QE specific)

Provide *summaries* (not the whole docs) plus links to files. Include:
- **Top 5 critical flows** with Gherkin acceptance criteria.
- **Env details**: base URL(s), auth bootstrap, flags.
- **Fixture plan**: personas, seed scripts, reset command.
- **Observability oracles**: exact metric/log keys to check.
- **Security notes**: roles/scopes; masking rules.
- **CI expectations**: which subset to run on PR vs. nightly.

---

## 5) Example prompts for the coding agent

> Copy–paste these and adjust names/paths. They request structured, reviewable output.

### 5.1 Plan the E2E suite

```text
You are a senior QA engineer. Using the summaries below, propose an E2E acceptance test plan.

Inputs:
- Critical flows: [Register → Login → Submit Loan → View Status], [Admin Review], [Logout]
- Acceptance criteria: (link) with GWT scenarios
- Env: BASE_URL, TEST_USER creds bootstrap via helper
- Data: seed command `pnpm test:seed`, reset `pnpm test:reset`
- Matrix: Chromium desktop, iPhone viewport; locale en-EE
- Observability: assert metric `loan_apply_requests_total` increments; audit log entry

Deliver:
1) A prioritized list of E2E scenarios (IDs mapped to user stories)
2) Page/Object model map
3) Tagging plan (@smoke, @regression, @quarantine)
4) Flake mitigation settings (timeouts/retries)
5) File tree for `tests/e2e`
```

### 5.2 Generate page objects & helpers

```text
Generate Page Object classes for:
- LoginPage, DashboardPage, LoanApplicationPage, AdminReviewPage

Conventions:
- Methods are high-level business actions (loginAs(user), submitLoan(payload))
- Selectors centralized; no test logic in POs
- Add helpers: auth.ts (login bootstrap), clock.ts (freeze time), observability.ts (assert metrics/logs)

Output: code stubs with TODOs and clear method names. Keep framework-agnostic where possible.
```

### 5.3 Implement acceptance specs from Gherkin

```text
Implement E2E specs for scenarios in `qa-acceptance-criteria.md`.

Requirements:
- Use Page Objects
- Seed/reset data with provided commands
- Assert UI result AND observability signals (metric + audit log)
- Tag @smoke for happy path; @regression for others
- Add screenshots on failure

Deliver: test files under `tests/e2e/specs/` with scenario IDs in names.
```

### 5.4 Seed data & personas

```text
Create fixtures for personas:
- customer_basic (verified)
- officer_admin

Provide:
- Fixture JSON
- Seed script `pnpm test:seed` (idempotent)
- Reset script `pnpm test:reset`

Ensure no PII in repo; use synthetic data. Output file paths + commands.
```

### 5.5 CI integration & reports

```text
Create CI configuration to run:
- On PR: @smoke only
- Nightly: all E2E
- Pre-release: all E2E + perf smoke

Also:
- Upload HTML report, JUnit XML, screenshots, videos
- Flake retries=2 in CI
- Fail PR if any @smoke fails

Deliver: `docs/qa-ci.md` updates and CI YAML snippet.
```

### 5.6 Accessibility & performance smoke (thin slice)

```text
Add minimal checks:
- Accessibility: basic ARIA/contrast rules on Login and Loan pages
- Performance: capture TTI/LCP-like timing or API p95 < 200 ms on submission

Deliver: extend specs or add `specs/smoke.a11y-perf.spec.*` with thresholds.
```

---

## 6) Conventions & guardrails for the agent

- **Keep tests deterministic**: fixed clock, stable data, avoid real-world flakiness.
- **Assert business outcomes, not implementation details** (no brittle selectors).
- **One flow per spec file, self-contained.**
- **Tagging**: `@smoke` (fast core), `@regression`, `@quarantine`.
- **Observability assertions**: prefer stable counters/histograms over log text, unless log keys are guaranteed.

