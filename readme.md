# Lucky Cart – QA Engineer Technical Assessment

Playwright TypeScript test suite for the Lucky Cart QA Engineer technical assessment.

## Project Structure

```text
luckycart-qa/
├── bruno/                  # Manual API test collections (Bruno)
├── helpers/
│   └── cart.ts             # Payload builders, API call helper, TypeScript interfaces
├── tests/
│   ├── cart-api.spec.ts    # API tests: authentication and cart eligibility
│   └── game-flow.spec.ts   # E2E test: eligible cart → game → win assertion
├── bug_report.md           # API bug report filed during assessment
├── .dockerignore
├── docker-compose.yml
├── Dockerfile
├── eslint.config.mjs
├── playwright.config.ts
├── tsconfig.json
└── .nvmrc
```

## Test Scenarios

### Cart API (`cart-api.spec.ts`)

| Scenario | Method | Expected Status | Expected Body |
| --- | --- | --- | --- |
| Wrong authentication parameters | POST | 401 | `{"error": "...", "status": 401}` |
| Non-eligible cart (totalAti < 50) | POST | 200 | `{}` |
| Eligible cart (totalAti >= 50) | POST | 200 | `{"ticket": "...", "baseDesktopUrl": "..."}` |

### Game Flow (`game-flow.spec.ts`)

1. Send eligible cart: Receive `baseDesktopUrl`
2. Navigate to game home page
3. Click "Play now"
4. Click "Spin the wheel!"
5. Assert "Congrats" is visible

## API Status

During the assessment, the Cart API (`https://api.luckycart.com/cart/ticket`) was found
to return `201 {}` for all request scenarios regardless of payload or authentication parameters.

This was reported to the Lucky Cart QA team and confirmed to be intentional.
The API is deliberately unavailable as part of the assessment. Tests are written against the specification,
not the current API behavior.

See `bug_report.md` for full details.

## Requirements

### Local

- Node.js 22 (see `.nvmrc`)
- npm

### Docker / Podman

- Docker or Podman with Compose

## Setup

```bash
nvm use
npm install
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests
npm test

# Run API tests only
npm run test:api

# Run game flow E2E test only
npm run test:game

# Open HTML report after a test run
npm run test:report
```

## Running with Docker / Podman

```bash
# Build and run tests in container
docker compose up --build

# HTML report will be exported to ./playwright-report/
```

Tests run headless inside the container. The HTML report is mounted
to your local `playwright-report/` directory after the run.

## Running Linter

```bash
npm run lint
```

## Manual API Testing

Bruno collections are included in the [bruno](./bruno/) directory covering all three scenarios:

- Eligible cart
- Non-eligible cart
- Wrong authentication

Open with [Bruno](https://www.usebruno.com/).

## Notes

- Cart IDs are generated using `crypto.randomUUID()` to guarantee no collisions
  between test runs or with existing API data
- Tests are written against the assessment specification
- Browser: Chromium (headless)
- ESLint enforces TypeScript strict rules. Run `npm run lint` before committing
