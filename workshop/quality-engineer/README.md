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

### 4. Implement Automated Tests
- Based on the test plan, implement **end-to-end automated tests**.  
- Use appropriate frameworks (e.g., Playwright, Cypress, Jest, or equivalent).  
- Commit tests incrementally:  
  - A single test or suite per commit.  
  - Reference corresponding user story/ticket.  

### 5. Provide Feedback to the Team
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
