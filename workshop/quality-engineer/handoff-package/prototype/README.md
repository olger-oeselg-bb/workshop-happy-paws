# Prototype — Happy Paws (SE → QE handoff)

Quick start (macOS / bash)

1. cd to the prototype folder

```bash
cd workshop/quality-engineer/handoff-package/prototype
```

2. Install dependencies

```bash
npm install
```

3. Start the server

```bash
npm run start
```

4. Open the app

```bash
open http://localhost:3000
```

5. Install Playwright browsers (first time only)

```bash
npx playwright install
```

6. Run tests

```bash
npm run test
```

Notes
- The server uses an in-memory store and exposes `/api/reset` for tests to reset state. Tests run against the local server and expect it to be available on port 3000.
- QE teams may port tests to Playwright, Cypress, or other E2E frameworks as preferred.
