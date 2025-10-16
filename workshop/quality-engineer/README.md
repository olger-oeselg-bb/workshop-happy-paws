# 🐾 Happy Paws Shelter – Quality Engineer Workshop Package

## Cover

**Project:** Pet Registry System  
**Organization:** Happy Paws Animal Shelter  
**Workshop Role:** Quality Engineer (QE)  
**Audience:** Quality Engineers in training workshop  
**Objective:** Practice building test plans, designing end-to-end flows, and implementing automated tests based on a working codebase.  
**AI Agent:** Use Github Copilot in agent mode, recommended model is GPT-5-mini, fallback model GPT-5 or Claude Sonnet 4.
PS! Keep in mind when you use GPT-5 or Claude sonnet 4 that they are premium models and take premium requests away from your real work. If you need to have those premium requests for real work, then please use GPT-5-mini.  

Happy Paws Shelter is a nonprofit struggling with fragmented processes.  
The **Business Analyst team** has gathered requirements and provided user stories and acceptance criteria.  
The **Software Engineer team** has implemented the first version of the Pet Registry System.  
As a **Quality Engineer**, your task is to **validate the solution**, ensure it meets requirements, and build a foundation for continuous testing.  

---

## Instructions for Quality Engineer Role

### 1. Review BA & SE Deliverables
- Read through the **user stories, acceptance criteria, and visuals** produced by Business Analysts.  
- Explore the **codebase and README** delivered by Software Engineers.  
- Clarify which features are in scope for the **MVP (Minimum Viable Product)**:  
  - Pet intake and profile management  
  - Adoption workflow  
  - Pet status updates (in shelter, foster, adopted, medical hold)  

### 2. Create a Test Plan
- Define **test scenarios** covering:  
  - Pet intake (adding new animals with required fields).  
  - Adoption process (application → approval → adoption).  
  - Status changes (shelter → foster → adopted → medical hold).  
- Include **positive paths** (expected behavior) and **negative paths** (invalid data, edge cases).  
- Map test cases back to **acceptance criteria** to ensure coverage.  

### 3. Identify an End-to-End Agent Flow
- Select one **realistic user journey** (e.g., “Shelter worker adds new dog → Adopter browses → Applies for adoption → Adoption completed → Contract stored”).  
- Break the flow into **discrete test steps**.  
- Document expected outcomes for each step.  

### 5. Implement Automated Tests
- Based on the test plan, implement **end-to-end automated tests**.  
- Use appropriate frameworks (e.g., Playwright, Cypress, Jest, or equivalent).  
- Commit tests incrementally:  
  - A single test or suite per commit.  
  - Reference corresponding user story/ticket.
- Example prompt for the coding agent to start work:
``` text
Please summarize the previous work done and then as a senior Quality Engineer, continue implementing the <insert name here> project's automated end-to-end acceptance testing based on QA tickets in QA_TICKETS.md

Keep in mind that:
- The overall testing plan is described in QA_PLAN.md.
- The architecture and system context are in ARCHITECTURE.md.
- The acceptance criteria are listed in QA_ACCEPTANCE_CRITERIA.md.

All of these contain vital information about what you are testing, how the system behaves, and what quality signals are expected.

Before starting each testing phase, create a new **feature branch dedicated to that phase.

For each subtask/ticket inside the phase:
- Implement the described test automation or validation (e.g., functional, E2E, regression, or observability checks).  
- Follow all existing test data, fixtures, and environment setup instructions.  
- Apply project-wide QA coding standards, structure, and conventions from QA_CONTRIBUTING.md.  
- Once the subtask is completed, commit the changes and mark the corresponding ticket as Done in QA_TICKETS.md.

After all subtasks in a phase are complete:
1. Run the full suite locally and ensure results are green.  
2. Generate and attach updated reports (coverage, screenshots, videos, metrics if applicable).  
3. Summarize the phase results, including which user stories, acceptance criteria, or requirements are now fully tested.  
4. Stop working and wait for manual review and approval before continuing.

---

Please continue with the following phase:

[Insert next phase name here based on your QA_TICKETS.md]
```

### 6. Provide Feedback to the Team
- Summarize test results: Which features passed, failed, or need refinement.  
- Highlight **gaps or risks** in functionality.  
- Suggest improvements (e.g., missing acceptance criteria, unclear flows).  

---

## Deliverables
By the end of the QE session, you should have:  
1. **Test plan** with mapped user stories and acceptance criteria.  
2. **End-to-end flow definition** (agent journey).  
3. **Automated tests** implemented and committed incrementally.  
4. **Test results report** summarizing coverage and findings.  
5. **Feedback notes** to Business Analysts and Engineers.  

These deliverables complete the **first full project cycle** of the workshop (BA → SE → QE).  

---
