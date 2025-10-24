# 🐾 Happy Paws Shelter – Software Engineer Workshop Package

## Cover

**Project:** Pet Registry System  
**Organization:** Happy Paws Animal Shelter  
**Workshop Role:** Software Engineer (SE)  
**Audience:** Software Engineers in training workshop  
**Objective:** Practice translating requirements into implementation plans, system architecture, and working code with incremental commits.  
**AI Agent:** Use Github Copilot in agent mode, recommended model is GPT-5-mini, fallback model GPT-5 or Claude Sonnet 4.
PS! Keep in mind when you use GPT-5 or Claude sonnet 4 that they are premium models and take premium requests away from your real work. If you need to have those premium requests for real work, then please use GPT-5-mini.  

Happy Paws Shelter is a nonprofit struggling with fragmented processes.  
The **Business Analyst team** has gathered stakeholder input and produced **user stories, acceptance criteria, and visuals**.  
As a **Software Engineer**, your task is to take these artifacts and **design and implement a working solution** that forms the foundation of the Pet Registry System.  

---

## Instructions for Software Engineer Role

### 1. Review BA Deliverables: the handoff package
- Go through the **user stories, acceptance criteria, wireframes and MVP scope** created by the Business Analyst role.
- Clarify scope: which features should be part of the **MVP (Minimum Viable Product)**?  
- Prioritize core workflows:  
  - Pet intake and profile management  
  - Adoption process (application → approval → adoption contract)  
  - Pet status updates (in shelter, foster, adopted, medical hold)  

### 2. Create Implementation Plan
- Draft a **phased implementation plan**.  
- Break features into **tickets** or **user story tasks**.  
- Define **priority order** (what comes first, what can wait).  
- Identify dependencies (e.g., pet intake must exist before adoption workflow).  

### 3. Propose Architecture & Tech Stack
- Decide on a **tech stack** (language, framework, database).  
- Design a **high-level architecture**:  
  - Backend (e.g., REST API or GraphQL, services)  
  - Frontend (web or mobile-first interface)  
  - Database (e.g., relational schema for pets, adopters, volunteers, medical records)  
- Document decisions briefly: why this stack fits the project.

### 4. Setting up context for coding agent
You can also use single chat session to generate the context files one-by-one. I would prefer to use folder agent-context/* to store the files regarding only agent and any other documentation can be put under /docs or in project root (README.md) 

Check into [Agent Context Setup Guide](./agent-context-setup-guide.md)


### 5. Implement Features
- Implement tickets incrementally, committing work in **small, logical steps**.  
- Each commit should map to a **ticket or feature** (e.g., “Add pet intake form,” “Implement adoption workflow step 1”). Give this as a guideline to the agent in context.
- Include basic data validation (e.g., pet must have name, type, status).  
- Prepare minimal but functional UI screens (text based work as well, often better).
- Example prompt for the coding agent to start work:
``` text
Please summarize the previous work completed, and then — acting as a Senior Software Engineer continue implementing the <insert project name here> project.

Your work should follow the tickets and project documentation as outlined below.

Reference Documents:

- TICKETS.md - Current tasks and subtasks to implement  
- PLAN.md - Overall implementation plan and roadmap  
- ARCHITECTURE.md - System architecture, technical decisions, and dependencies  

These documents contain all vital information about the application you are building — including scope, data model, API design, and non-functional requirements.

Workflow Instructions:

1. Before each phase:
   - Create a **new feature branch** named after the phase (e.g., `feature/<phase-name>`).

2. During each phase:
   - Implement the features and changes described in the corresponding tickets.
   - Follow all coding standards, conventions, and practices defined in project documentation.
   - Ensure tests pass and code adheres to architecture and design principles.

3. After each subtask/ticket:
   - Commit your changes with a clear and descriptive commit message.
   - Mark the corresponding ticket as Done in TICKETS.md.

4. After completing the entire phase:
   - Present a summary of changes and show the updated files.
   - Wait for manual review and approval before continuing to the next phase.

---

Please continue with the following phase:

[Insert phase here based on your TICKETS.md]
```

### 6. Prepare for Hand-off to Quality Engineers
- Ensure the codebase is **clean, structured, and buildable**.  
- Provide a **README** with setup instructions.  
- Tag commits or branches clearly so Quality Engineers can run tests.  

---

## Deliverables
By the end of the SE session, you should have:  
1. **Implementation plan with phases and tickets.**  
2. **Architecture + tech stack overview.**  
3. **Working codebase** implementing core pet registry features.  
4. **Commit history** reflecting incremental, ticket-based progress.  
5. **README/setup guide** for Quality Engineers.  

These deliverables will be handed off to **Quality Engineers** in the next workshop phase.  

---
