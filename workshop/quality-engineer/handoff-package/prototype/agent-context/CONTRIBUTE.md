# Contributing to Happy Paws Prototype

Welcome! This guide explains how to set up the prototype locally, run tests, follow coding standards, and pass quality gates. The goal is fast, collaborative iteration with high baseline quality.

---
## 1. Local Run Instructions

### Prerequisites
- macOS (other Unix systems likely fine)
- Node.js 24.x (LTS) recommended
- npm 10.x

Check versions:
```bash
node -v
npm -v
```

### Standard Local Setup
```bash
cd workshop/quality-engineer/handoff-package/prototype
npm install
npm run start
open http://localhost:3000
```
The server starts on port `3000` (Express, in-memory store). Stop with Ctrl+C.

### Resetting App State
Tests (and manual workflows) can reset state:
```bash
curl -X POST http://localhost:3000/api/reset
```

### Playwright Browsers (first time only)
```bash
npx playwright install
```

### Optional: Ephemeral Docker Run
_No Dockerfile currently in repo._ If you need a temporary container:
```bash
# Build a quick image (uses node:20-alpine base)
cat > Dockerfile <<'EOF'
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm","run","start"]
EOF

docker build -t happy-paws-prototype .
docker run --rm -p 3000:3000 happy-paws-prototype
```
Then browse to http://localhost:3000.
Consider contributing an official Dockerfile if container workflows become common.

### Live Dev Logging
Use `npm run dev` (currently same as start; may evolve to add watchers). Logs use `pino` with pretty output when desired:
```bash
NODE_ENV=development npm run start
```

---
## 2. Test Instructions

### Run All Tests
```bash
npm run test
```
This runs Playwright tests under `tests/`.

### Headed / Debug Mode
```bash
npx playwright test --headed --debug
```

### Single Test File
```bash
npx playwright test tests/e2e.spec.js
```

### Trace / Video Capture
```bash
npx playwright test --trace on --video on
```
Artifacts will be stored in Playwright's default output locations.

### Adding New Tests
- Place new test files in `tests/` with suffix `.spec.js` or `.test.js`.
- Keep them independent: use `/api/reset` at start if state matters.
- Prefer data selectors (`data-testid`) if front-end evolves; propose adding them.

### Test Verification
A merge candidate must:
- Have all tests green.
- (Future) Meet minimum coverage threshold once coverage tooling is added (see Quality Gates).

---
## 3. Coding Standards

### Style & Formatting
- Use Prettier: run `npm run format` to auto-format.
- ESLint: run `npm run lint` (or `npm run lint:fix`).
- No unused variables, no console noise (prefer `logger.js`).

### Language & Naming
- JavaScript (ES modules can be proposed later; currently CommonJS style if changed—verify before refactors).
- Filenames: `kebab-case` for scripts, `PascalCase` reserved for React or classes (future frontend changes). Node modules here: keep `lowercase-with-dashes`.
- Functions: verbs first (`loadSeeds`, `createUploadRecord`).
- Configuration/environment placeholders: uppercase snake case (`PORT`, `LOG_LEVEL`).

### Logging
- Use `pino` via the existing `logger.js` wrapper (if available; otherwise add one). Avoid `console.log` in production paths.

### Error Handling
- Return consistent JSON error shapes: `{ error: { code, message } }` (propose if not yet standardized).

### Commits
Adopt Conventional Commits:
- `feat: add adoption flow`
- `fix: handle empty upload list`
- `chore: bump dependencies`
- `test: add playwright trace example`
- `docs: update architecture notes`

Include scope when helpful: `feat(router): add health endpoint`.

### Pull Request Etiquette
- Small, focused PRs (< ~300 lines diff where possible).
- Include: intent summary, before/after behavior, any migration notes.
- Link relevant ticket from `TICKETS.md` or issue tracker.

---
## 4. Dependencies & Environment

### Package Manager
- npm (lockfile: `package-lock.json` should be committed if generated).

### Runtime Dependencies (from `package.json`)
| Package        | Version  |
|----------------|----------|
| express        | ^5.1.0   |
| body-parser    | ^2.2.0   |
| multer         | ^2.0.2   |
| cors           | ^2.8.5   |
| lowdb          | ^7.0.1   |
| pino           | ^9.11.0  |
| pino-pretty    | ^13.1.1  |

### Dev Dependencies
| Package              | Version   |
|----------------------|-----------|
| @playwright/test     | ^1.55.1   |
| eslint               | ^9.36.0   |
| eslint-config-prettier| ^10.1.8  |
| eslint-plugin-node   | ^11.1.0   |
| globals              | ^16.4.0   |
| prettier             | ^3.6.2    |

### Node Version Pinning
Consider adding an `.nvmrc`:
```
24
```

### Environment Variables (Future-Proofing)
Currently none required. Potential additions (document when introduced):
- `PORT` (default 3000)
- `LOG_LEVEL` (e.g., info, debug)
- `DATA_STORE` (switch from in-memory to persistent)

Add a `.env.example` when variables appear.

### Updating Dependencies
```bash
npm outdated
npm audit
```
Open PR: `chore(deps): upgrade express to 5.1.x` with changelog notes.

---
## 5. Branching Strategy

### Approach: Trunk-Based with Short-Lived Feature Branches
- `main` is always deployable / stable.
- Branch naming: `feat/<short-description>`, `fix/<issue-id>`, `chore/<task>`, `test/<scenario>`, `docs/<area>`.
- Rebase onto `main` before opening PR (avoid merge commits where possible).
- Delete branches after merge.

### Releases
- Lightweight; tag as needed: `v0.1.0`, `v0.1.1`.

### Hotfixes
- Branch from `main`: `hotfix/<issue>`.
- Fast review, ensure tests pass, then tag.

---
## 6. Quality Gates

A PR must pass these checks before merge:

1. Lint
   - `npm run lint` must exit 0.
   - No new warnings unless justified.
2. Tests
   - `npm run test` green.
   - (Future) Include trace for flaky tests.
3. Coverage (Planned)
   - Introduce NYC or Playwright coverage integration.
   - Target initial threshold: 60%, ratchet upward gradually.
4. Security
   - `npm audit` no High/Critical vulnerabilities without documented mitigation.
5. Dependency Hygiene
   - No unpinned major upgrades without review.
6. Size / Complexity (Advisory)
   - Flag PRs > ~500 changed lines for deeper review.
7. Docs
   - If architectural change, update `ARCHITECTURE.md`.

### Suggested Future Automation
- GitHub Actions workflow: lint + test + audit.
- Add `coverage/` artifact upload.
- OWASP dependency check (optional).

---
## 7. Contribution Flow Summary
1. Create branch.
2. Implement change (keep scope tight).
3. Run: `npm run lint && npm run test` (and optionally `npm audit`).
4. Commit with Conventional Commit message.
5. Open PR with context + ticket link.
6. Address review feedback.
7. Merge (squash or rebase preferred) once all gates pass.

---
## 8. Communication & Tracking
- Reference items in `TICKETS.md` (or external issue tracker when adopted).
- Use PR discussion for design clarifications; escalate larger shifts to ADR-style note appended to `ARCHITECTURE.md`.

---
## 9. Getting Help
- Unsure about a pattern? Open a `docs:` PR draft.
- Performance concern? Add reproducible script + measurements.
- Flaky test? Tag with `@flaky` (add a convention) and open issue.

---
## 10. Roadmap (Incremental Improvements)
- Add official Dockerfile.
- Introduce test coverage tooling.
- Implement persistent storage (replace in-memory / `lowdb`).
- Add health & metrics endpoints.
- CI automation.

---
Thanks for helping make Happy Paws better. 🐾
