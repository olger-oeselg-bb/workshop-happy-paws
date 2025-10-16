# Alternative Syntaxes for `qa-acceptance-criteria.md`

> **Purpose:**  
> Define how to express acceptance criteria in a way that’s clear to humans and usable by coding agents (e.g., Copilot, Codex, or other LLM-based QA/test automation systems).  
> Gherkin (`Given/When/Then`) is common, but several alternative syntaxes work better for automation and structured documentation.

---

## 1. Behavior-Driven Formats

### Gherkin (Cucumber / Behave)

**Syntax:**
```gherkin
Scenario: Loan submission
  Given I am logged in
  When I submit a valid loan
  Then I see confirmation
```

**Pros:**
- Industry standard (Cucumber, SpecFlow, Behave, Behat).
- Natural-language readable.
- Easy mapping to step definitions.

**Cons:**
- Verbose for complex conditions.
- Parsing differences across tools.
- Harder for agents to extract exact data without consistent formatting.

### Structured BDD Table Syntax (Markdown Tables)
**Syntax:**
```text
| ID | Scenario | Preconditions | Action | Expected Result |
|----|-----------|---------------|---------|-----------------|
| AC-01 | Loan submission success | Customer logged in, valid fields | Submit application | Confirmation with ID |
| AC-02 | Missing amount validation | Customer logged in | Submit without amount | Inline error "Amount is required" |

```
**Pros:**
- Simple, tabular, deterministic.
- Excellent for AI parsing and for diffing in Git.
- Easy to export to CSV/test management tools.

**Cons:**
- Less expressive for long flows.
- No native automation framework parsing.

**Best for**: small/medium projects, where QA uses agents or scripts to generate tests automatically.

### YAML / JSON Specification (Machine-friendly BDD)
**YAML Syntax:**
```yaml
- id: AC-01
  title: Loan submission success
  preconditions:
    - Customer logged in
    - Valid loan form
  steps:
    - action: Submit loan application
      expected: Confirmation shown with application ID
  tags: [smoke, happy-path]
```

**JSON Syntax:**
```json
{
  "id": "AC-02",
  "title": "Missing amount validation",
  "preconditions": ["Customer logged in"],
  "steps": [
    {"action": "Submit loan without amount", "expected": "Inline error 'Amount is required'"}
  ],
  "tags": ["regression", "validation"]
}
```

**Pros:**
- Machine-readable (ideal for AI agents, test code generation, dashboards).
- Easy to map one-to-one with automated tests.
- Supports metadata (priority, tags, owners).

**Cons:**
- Less human-friendly than Markdown/Gherkin.
- Harder for non-technical stakeholders to read.

**Best for**: agent automation pipelines or CI/CD-integrated QA documentation.

### Scenario Outline + Data Tables (Structured Markdown Hybrid)

**Syntax:**
```text
### Scenario: Loan application validations

| Case | Input | Expected Result |
|-------|-------|-----------------|
| 1 | All fields valid | Success message |
| 2 | Missing amount | Inline error "Amount required" |
| 3 | Invalid term | Inline error "Invalid term length" |

```
**Pros:**
- Compact for multiple data-driven cases.
- Easy for agents to expand into multiple tests.
- Familiar Markdown, no parser dependency.

**Cons:**
- Doesn’t express multi-step flows well.
- Requires convention for interpretation.

### Pseudo-code Narrative
**Syntax:**
```text
Scenario: Customer submits loan

Preconditions:
  - Customer has account
  - Logged in
Steps:
  1. Navigate to Loan Application page
  2. Fill valid form
  3. Click Submit
Expected:
  - HTTP 200 response
  - Confirmation UI visible
  - Audit log "APPLICATION_SUBMITTED"
```
**Pros:**
- Very readable.
- Ideal when QA and engineers use plain text docs.
- Easy for AI to parse line-by-line.

**Cons:**
- Non-standard; needs consistent headings.

---

## 2. Selecting the Right Format

| Context                                  | Recommended Syntax            |
| ---------------------------------------- | ----------------------------- |
| Cross-functional BDD with Product Owners | **Gherkin**                   |
| AI-driven or generated tests             | **YAML / JSON**               |
| Lightweight internal QA docs             | **Markdown tables**           |
| Data-driven testing                      | **Scenario Outline / Hybrid** |
| Early MVP or text wireframe stage        | **Pseudo-code Narrative**     |

---

## 3. Tip for AI/Coding Agents

If your goal is to **feed acceptance criteria** to a coding agent for test generation (e.g., Playwright, Cypress, Jest, etc.), prefer **structured YAML or Markdown table** syntax.
It balances human readability with machine consistency.

### Example agent prompt.

> **PS! it is better to use the example from [README.md](./README.md) as an initial prompt for phase start**

Use the following prompt if you want to generate tests one-by-one and you want to paste cases in each time and don't have them written already in QA_TICKETS.md:

```text
You are a QA automation assistant.
Use the following acceptance criteria (YAML) to generate automated E2E tests.

Each scenario should:
- Use Page Object methods
- Cover preconditions, actions, expected outcomes
- Tag tests by "tags" field
- Include assertions for both UI and backend state

Input format:
<insert YAML or table here>
```
