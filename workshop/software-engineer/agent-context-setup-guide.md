# Coding Agent Setup Guide

> **Purpose:**  
> Help software engineers use an AI coding agent effectively when starting a new project.  
> This guide defines *what information to provide*, *how to structure prompts*, and *what outputs to expect*.

---

## 1. Inputs from Project Handover

The coding agent needs a complete understanding of *why the system exists* and *what problem it solves* before writing code.

You should have these three sources:

1. **User stories per stakeholder**  
   → Explain business goals and workflows.
2. **MVP scope**  
   → Defines what must be built in the first version.
3. **Text-based wireframes**  
   → Describe layout and user interaction flow.

Optional but recommended:

- Any design principles, domain constraints, or compliance notes.
- Example APIs from similar internal systems.

---

## 2. What context to generate for the coding agent

The mission here is to generate a *complete project context* that will guide all later work for the coding agent.

Try to create the following context files for coding agent in your project's ./agent-context (in this order):

### a) **Set up your git repository and start new project**
- Set up git repository with `git init``
- Start node.js project with `npm init` (or any other technology specific project you choose, Spring Boot, Kotlin, Svelte etc)

### b) **Architecture Context**
- **Overview:** high-level description of components, communication, and responsibilities.
- **Project structure:** recommended folders, modules, and frameworks.
- **API definition:** list of endpoints or GraphQL queries/mutations, with payloads and status codes.
- **Data model & database:** schema, relationships, migrations.
- **Design decisions:** trade-offs, patterns used, libraries chosen.
- **Error handling:** conventions, taxonomy, retry/backoff.
- **Logging & observability:** levels, structure, metrics, traces.
- **Non-functional requirements (NFRs):** performance, scalability, availability, test coverage targets.
- **Security & compliance constraints:** authN/authZ, data retention, GDPR/PII, audit trail, encryption, 4-eye rules.

### c) **Project Plan (Scope & Domain)**
- **MVP scope:** what to implement now.
- **Later scope:** what to defer or plan for next phases.
- **Domain glossary:** key domain terms and definitions (customer, loan, application, etc.).

### d) **Tickets**
- Based on user stories.
- Each ticket should be **0.5–1 story point**, meaning small and implementable within 2–4 hours.
- Include tickets for:
  - Scaffolding and project setup  
  - Environment configuration  
  - API endpoints  
  - Database migrations  
  - Frontend components  
  - Testing, CI/CD, and observability
- Group tickets into **logical phases** (e.g., Setup → Core Features → Integrations → QA).
- Each ticket can be marked as DONE like this: [ ] -> [x]

### e) **Contributing Guide**
- **Run instructions:** how to set up and start locally (Docker, npm, etc.).
- **Test instructions:** how to execute and verify tests.
- **Coding standards:** formatting, linting, naming, commit messages.
- **Dependencies:** versions, package managers, environment variables.
- **Branching strategy:** e.g., trunk-based, feature branches, PR review.
- **Quality gates:** lint, tests, coverage, security scans.

### f) **AGENTS.md**
You can use [AGENTS.md](https://agents.md/) to replace README.md or CONTRIBUTING.md for project related info, mostly about coding style, how to run it or you can also use both at the same time, where AGENTS.md only has agent specific additions. The possibilities are endless how to split the context for the agent

### g) **How to use the generated context?**
Provide the generated context when you start with each development phase or new chat window.

What to generate is also good question and how much and what works the best? As we covered the goal is to have as high success rate as possible to increase our own productivity.

*PS! You can always write the full context yourself as well, it doesn't need to be generated, but it is faster this way. You can also reuse parts between projects*

---

## 3. What You Must Provide to the Agent

You can also ask coding agent what it needs for effective work as context.

To generate high-quality context, include:

| Type | Example |
|------|----------|
| **Project summary** | “This project builds a digital onboarding platform for SME clients applying for loans.” |
| **Stakeholders & user stories** | Summarize 3–6 per stakeholder with acceptance criteria. |
| **MVP scope** | “Includes user registration, loan application form, admin review UI. Out of scope: credit scoring.” |
| **Text-based wireframes** | “Dashboard has: header, list of active applications, button ‘New Application’.” |
| **Technology constraints** | “Frontend: Vue 3 + Tailwind, Backend: Node.js + Express + PostgreSQL.” |
| **Regulatory/compliance notes** | “PII must be encrypted; audit logs required for all account changes.” |

Optional but powerful:
- Example API payloads or schemas.
- Any existing reusable modules.
- Performance or security targets.

---

## 4. Example Prompts for Context Generation

### 4.1. Generate Architecture Context

```text
You are a senior software engineer designing a new web application.

Handover materials include:
- User stories per stakeholder
- MVP scope
- Text-based wireframes

Goal:
Generate a complete **architecture context** for a project using

My preferred architecture:
Node.js (TypeScript) backend, Vue 3 frontend, and MongoDB database.

Include:
1. System overview
2. Project folder structure (backend + frontend)
3. API definition (routes, payloads, responses)
4. Data model and database schema
5. Key design decisions
6. Error handling strategy
7. Logging and observability approach
8. NFRs (performance, scalability, test coverage)
9. Security & compliance constraints (GDPR, audit logs, authN/Z)
```

### 4.2. Generate Project Plan & Scope

```text
Using the architecture above and MVP handover data,
create a structured **project plan**.

Include:
1. MVP scope summary
2. Later / extended scope
3. Domain glossary (10–20 business terms)
4. Dependencies between major features
```

### 4.3. Generate Tickets

```text
You are a senior engineer planning backlog items from user stories.

Create a list of **engineering tickets**, each sized 0.5–1 story point,
that together cover the MVP. Include project scaffolding and technical setup tasks.

Group tickets into phases:
- Phase 1: Project setup
- Phase 2: Core features
- Phase 3: Integrations and testing
- Phase 4: QA and deployment

Each ticket should have:
- Title
- Description
- Expected outcome
- Related user story
- Estimation (0.5 or 1 point)
```

### 4.4. Generate Contribution Guide

```text
Generate a `CONTRIBUTING.md` file for this project.

Include:
- Run and test instructions (backend + frontend)
- Coding standards (TypeScript + Vue)
- Git branching & commit rules
- Linting, formatting, and testing requirements
- Dependency management
- Environment setup (Docker Compose)
- Quality gates before merge
```

---

## 5. Prompting best practices

| Practice                                                | Why It Matters                                                 |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| **Provide all handover materials in summarized form**   | The agent must “see the world” to make coherent designs.       |
| **Be explicit about stack, framework, and constraints** | Prevents it from guessing wrong defaults.                      |
| **Ask for structured output**                           | Easier to copy into docs and version control.                  |
| **Iterate in stages**                                   | One clear goal per prompt = more accurate responses.           |
| **Review and refine**                                   | Treat the agent as a collaborator, not an oracle.              |
| **Use temperature / randomness wisely (if supported)**  | Lower values (0.2–0.4) produce more consistent technical docs. |
| **Never share sensitive data**                          | Use placeholders for credentials, API keys, etc.               |
| **Keep context window short and relevant**              | Summaries > entire text dumps.                                 |

## 6. Optional additional contexts

If applicable, also generate:

- Test Strategy & QA context (unit, integration, E2E)
- Deployment & CI/CD context
- Monitoring setup
- Versioning and branching policy
- Localization or accessibility guidelines
- Performance test baseline

These can be added later once the main context is ready.