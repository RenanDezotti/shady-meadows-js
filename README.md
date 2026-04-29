# shady-meadows-js

SDET technical challenge for Shady Meadows B&B. The project has two parts: UI tests with Playwright (JavaScript) and API tests with Karate DSL (Java/Maven).

---

## Tech stack

- **Playwright** — UI automation (JavaScript)
- **Karate DSL 1.4.1** — API automation (Java 17, Maven)
- **GitHub Actions** — CI/CD pipeline

---

## Project structure

```
shady-meadows-js/
├── playwright-ui/
│   ├── pages/
│   │   ├── BasePage.js
│   │   ├── HomePage.js
│   │   └── AdminPage.js
│   ├── tests/
│   │   ├── sanity/homepage.spec.js
│   │   └── admin/admin.spec.js
│   ├── test-data/credentials.js
│   └── playwright.config.js
└── karate-api/
    ├── pom.xml
    └── src/test/
        ├── java/shadymeadows/TestRunnerTest.java
        └── resources/
            ├── karate-config.js
            └── shadymeadows/
                ├── branding.feature
                ├── rooms.feature
                └── booking.feature
```

---

## Part 1 — Playwright UI tests

### Requirements

- Node.js 18+

### Install

```bash
cd playwright-ui
npm install
npx playwright install
```

### Run

```bash
npx playwright test
npx playwright test --headed        # with browser visible
npx playwright show-report          # open HTML report
```

### Test results

| Suite | Tests | Result |
|---|---|---|
| Homepage sanity | 5 | ✅ Pass |
| Admin auth | 5 | ✅ Pass |
| Room count comparison (bonus) | 1 | ❌ Intentional fail — see Bug #1 |

**Total: 10 pass, 1 intentional fail**

---

## Part 2 — Karate API tests

### Requirements

- **Java 17** (required — Karate 1.4.1 is not compatible with Java 21+)
- Maven 3.9+

### Run

```bash
cd karate-api

# Windows (Git Bash)
JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot" mvn test -U

# macOS / Linux
JAVA_HOME=/path/to/java17 mvn test
```

### Feature files

| File | Endpoint | What it tests |
|---|---|---|
| `branding.feature` | `GET /branding/` | Name equals "Shady Meadows B&B", email matches regex |
| `rooms.feature` | `GET /room/` | Response is array, at least one room with price > 0 |
| `booking.feature` | `POST /booking/` | Creates booking using dynamic roomId from GET /room |

### ⚠️ Environment issue

The site `automationintesting.online` was migrated to **Next.js 2.0** in March 2025. After this migration, the backend microservice endpoints (`/branding/`, `/room/`, `/booking/`) stopped responding to direct HTTP requests, the Next.js frontend returns 404 for all of them.

This is an environment issue, not a test logic issue. The feature files are correct and would pass against a working instance of the platform.

**To run against a local instance:**

```bash
git clone https://github.com/mwinteringham/restful-booker-platform
cd restful-booker-platform
bash build_locally.sh
```

Then update `karate-config.js`:

```javascript
function fn() {
  return {
    baseUrl: 'http://localhost:8080',
    adminUsername: 'admin',
    adminPassword: 'password'
  };
}
```

---

## Bugs found

**Bug #1 — Room count inconsistency (Playwright)**

The admin panel and the public homepage show a different number of rooms. The admin panel lists all rooms regardless of status, while the homepage only shows rooms available for booking. This mismatch is inconsistent and could mislead users about actual availability. The test in `admin.spec.js` documents this as an intentional failure.

**Bug #2 — API endpoints unavailable on public site (Karate)**

After the Next.js 2.0 migration, `GET /branding/`, `GET /room/` and `POST /booking/` all return 404 from `automationintesting.online`. The backend microservices are not exposed via the new frontend. This blocks the full Karate suite from running against the public environment.

---

## CI/CD

A GitHub Actions workflow is included at `.github/workflows/tests.yml`. It runs the Playwright suite automatically on every push to `main`.

The Karate suite is excluded from CI until the public API endpoints are restored or a local environment is available via Docker.

---

## Credentials

```
URL:      https://automationintesting.online
Username: admin
Password: password
```
