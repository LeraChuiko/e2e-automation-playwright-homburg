# 🏛️ Test Automation Project: Homburg Appointment Booking System

An automated end-to-end (E2E) testing framework engineered for the municipal appointment booking widget used by the City of Homburg ([termine-reservieren.de/termine/homburg/](https://termine-reservieren.de/termine/homburg/)).

---

## 📺 Video Demonstration

Click the preview image below to watch the automated end-to-end booking scenario in action:

[![Watch the E2E Test Video](https://img.youtube.com/vi/-NhEhptZ2_o/hqdefault.jpg)](https://youtu.be/-NhEhptZ2_o)

---

## 📋 Project Documentation Links (QA Artifacts)

All analytical and manual QA artifacts produced during this project are accessible directly via the relative links below (clicking a link opens the corresponding PDF document inside GitHub):

* 📘 **[Master Project Overview & Test Plan](./docs/Project_overview_test_plan.pdf)** — Comprehensive strategy, session business rules, constraints, and scope.
* 📊 **[Requirements Traceability Matrix (RTM Matrix)](./docs/Test_scenarios.pdf)** — Logical mapping defining functional coverage between User Stories and automated scripts.
* 📝 **[Manual Test Cases Ledger](./docs/Manual_test_cases.pdf)** — Step-by-step test design conditions executed for local baseline validations.
* 🐛 **[Formal Bug Report](./docs/Bug_report.pdf)** — Structural defect logging identifying application failures (Validation Defect BR_01 regarding special characters input).
* 📋 **[UI/UX & Accessibility Checklist](./docs/Checklist.pdf)** — Responsiveness audits on mobile breakpoints (e.g., iPhone 13/14 widths) and BITV 2.0 / WCAG 2.1 cross-compliance logs.
* 📉 **[Test Execution Report](./docs/Test_execution_report.pdf)** — Log of processed scenario verdicts and system behaviors.
* 🏆 **[Final Test Summary Report](./docs/Final_test_report.pdf)** — Executive summary report compiling all execution outputs.

---

## 🚀 Core Tech Stack & Architecture

- **Core Framework:** Playwright (Node.js engine)
- **Programming Language:** JavaScript (ES6+)
- **Architecture Design:** Functional Helper-Based approach (`helpers.js`) ensuring seamless locator abstraction and dry code management.
- **State Control & Interception:** Utilizes built-in API/Network Mocking via `page.route()` to enforce backend infrastructure faults (HTTP 500 Simulation) and programmatic DOM-level injection to assert deterministic calendar edge cases.

---

## ⚠️ CI/CD Execution Note & Constraints
A deployment pipeline is fully configured inside `.github/workflows/playwright.yml`. However, please note that the live target website enforces strict cloud-infrastructure firewall policies (AWS/Cloudflare bot blocking mechanisms). For full, deterministic test suite verification, execution is optimally maintained via local environments.

---

## 🤝 Connect With Me

If you have any questions regarding this test framework architecture, QA processes, or would like to discuss professional collaboration opportunities, feel free to reach out:

💼 **[Connect with me on LinkedIn](https://www.linkedin.com/in/valeriia-chuiko/)**