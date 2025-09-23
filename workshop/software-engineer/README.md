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

### 1. Review BA Deliverables
- Go through the **user stories, acceptance criteria, and visuals** created by the Business Analyst role.  
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

### 4. Implement Core Features
- Implement tickets incrementally, committing work in **small, logical steps**.  
- Each commit should map to a **ticket or feature** (e.g., “Add pet intake form,” “Implement adoption workflow step 1”).  
- Include basic data validation (e.g., pet must have name, type, status).  
- Prepare minimal but functional UI screens.  

### 5. Prepare for Hand-off to Quality Engineers
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
