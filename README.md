# 🏛️ Test Automation Project: Homburg Appointment Booking System

An automated end-to-end (E2E) testing framework engineered for the municipal appointment booking widget used by the City of Homburg ([termine-reservieren.de/termine/homburg/](https://termine-reservieren.de/termine/homburg/)).

## 📺 Video Demonstration

Click the preview image below to watch the automated end-to-end booking scenario in action:

[![Watch the E2E Test Video](https://img.youtube.com/vi/-NhEhptZ2_o/hqdefault.jpg)](https://youtu.be/-NhEhptZ2_o)

## 📋 Project Documentation

The documentation files are available in the `docs/` folder:

- **[Project Overview & Test Plan](./docs/Project_overview_test_plan.pdf)** — Test strategy, business rules, and project scope.
- **[Test Scenarios](./docs/Test_scenarios.pdf)** — High-level list of automated and manual test scenarios.
- **[Manual Test Cases](./docs/Manual_test_cases.pdf)** — Detailed test cases for manual validation.
- **[Bug Report](./docs/Bug_report.pdf)** — Documented application defects found during testing.
- **[UI/UX & Accessibility Checklist](./docs/Checklist.pdf)** — Mobile responsiveness (430px) and BITV 2.0 / WCAG 2.1 accessibility checks.
- **[Test Execution Report](./docs/Test_execution_report.pdf)** — Summary of test results and verdicts.

## 🚀 Tech Stack & Architecture

- **Framework:** Playwright (Node.js)
- **Language:** JavaScript (ES6+)
- **Architecture Design:** Helper-based modular structure (`helpers.js`) to keep locators and reusable actions organized.
- **Network Interception & Safety:** API mocking using `page.route()` to simulate server failures (HTTP 500) and handle appointment slot selection safely without creating real database holds.
- **Virtual Time Manipulation:**
- Virtual Time Manipulation: Fast-forwarding client-side session timers via `page.clock` for instant execution of timeout scenarios.
- Automated Accessibility Auditing: Integrated `@axe-core/playwright` to validate WCAG 2.1 / BITV 2.0 compliance across all booking steps.

## ⚡ Quick Start

### Setup & Installation

```bash
git clone https://github.com/LeraChuiko/e2e-automation-playwright-homburg.git
cd e2e-automation-playwright-homburg
npm install
npx playwright install chromium
```

### Execution Commands

```bash
npm test             # Run all tests in Headless mode
npm run test:ui      # Run tests in Playwright Interactive UI Mode
npm run test:headed  # Run tests in Headed mode (Visible browser)
npm run report       # Generate and view the HTML execution report
```

## ⚠️ CI/CD Execution Note & Constraints

A GitHub Actions workflow is fully configured in `.github/workflows/playwright.yml`. However, because the live target application uses aggressive Cloudflare/AWS bot-detection mechanisms that block hosted CI/CD runners, the test suite is optimally maintained and executed in local environments to ensure consistent, flake-free execution.

## 🤝 Connect With Me

If you have any questions regarding this test framework architecture, QA processes, or would like to discuss professional collaboration opportunities, feel free to reach out:

💼 **[Connect with me on LinkedIn](https://www.linkedin.com/in/valeriia-chuiko/)**
