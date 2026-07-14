# 🏛️ Test Automation Project: Homburg Appointment Booking System

An automated end-to-end (E2E) testing framework engineered for the municipal appointment booking widget used by the City of Homburg ([termine-reservieren.de/termine/homburg/](https://termine-reservieren.de/termine/homburg/)).


## 📺 Video Demonstration

Click the preview image below to watch the automated end-to-end booking scenario in action:

[![Watch the E2E Test Video](https://img.youtube.com/vi/-NhEhptZ2_o/hqdefault.jpg)](https://youtu.be/-NhEhptZ2_o)


## 📋 Project Documentation Links (QA Artifacts)

All analytical and manual QA artifacts produced during this project are accessible directly via the relative links below (clicking a link opens the corresponding PDF document inside GitHub):

- **[Master Project Overview & Test Plan](./docs/Project_overview_test_plan.pdf)** — Comprehensive strategy, session business rules, constraints, and scope.
- **[High-Level Test Scenarios](./docs/Test_scenarios.pdf)** — Architectural map and logical coverage of the mapped functionalities.
- **[Manual Test Cases Ledger](./docs/Manual_test_cases.pdf)** — Step-by-step test design conditions executed for local baseline validations.
- **[Formal Bug Report](./docs/Bug_report.pdf)** — Structural defect logging identifying application failures (including validation bypasses on Step 5).
- **[UI/UX & Accessibility Checklist](./docs/Checklist.pdf)** — Responsiveness audits on mobile breakpoints (e.g., iPhone 13/14 widths) and BITV 2.0 / WCAG 2.1 cross-compliance logs.
- **[Test Execution Report](./docs/Test_execution_report.pdf)** — Log of processed scenario verdicts and system behaviors.


## 🚀 Core Tech Stack & Architecture

- **Core Framework:** Playwright (Node.js engine)
- **Programming Language:** JavaScript (ES6+)
- **Architecture Design:** Functional Helper-Based approach (`helpers.js`) ensuring seamless locator abstraction and DRY code management.
- **State Control & Interception:** Utilizes built-in API/Network Mocking via `page.route()` to simulate infrastructure faults (HTTP 500) and DOM-level evaluation (`page.evaluate()`) to assert deterministic calendar edge cases.


## ⚠️ CI/CD Execution Note & Constraints
A GitHub Actions workflow is fully configured in `.github/workflows/playwright.yml`. However, because the live target application uses aggressive Cloudflare/AWS bot-detection mechanisms that block hosted CI/CD runners, the test suite is optimally maintained and executed in local environments to ensure consistent, flake-free execution.


## 🤝 Connect With Me

If you have any questions regarding this test framework architecture, QA processes, or would like to discuss professional collaboration opportunities, feel free to reach out:

💼 **[Connect with me on LinkedIn](https://www.linkedin.com/in/valeriia-chuiko/)**