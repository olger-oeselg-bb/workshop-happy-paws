# 🐾 Happy Paws Shelter – System Analyst Workshop Package

## Cover

**Project:** Pet Registry System  
**Organization:** Happy Paws Animal Shelter  
**Workshop Role:** System Analyst (SA)  
**Audience:** System Analysts, Technical Designers, Integration Specialists  
**Objective:** Translate business requirements into precise **system specifications, architecture, and data models** that guide implementation.
**Using AI Assistant:** Microsoft 365 Copilot Chat (in Teams) or local. You can also use something else in workshop setting and propose tools.

Happy Paws Shelter is a growing nonprofit animal shelter struggling with fragmented processes. They use spreadsheets, paper notes, and manual communication to manage pets, volunteers, adopters, and medical partners.
The board has requested a **Pet Registry System** to make operations more efficient, improve adoption rates, and increase transparency.

The **Business Analyst team** has already defined user stories and acceptance criteria.  

Your task as the **System Analyst** is to design **how the system will work**, including its structure, components, and data relationships.

You act as the bridge between **business understanding (BA)** and **technical implementation (SWE)**.

---

## Instructions for System Analyst Role

### 1. Review BA Deliverables: the handoff package
- Go through the **user stories, acceptance criteria, wireframes and MVP scope** created by the Business Analyst role.  
- Clarify scope: which features should be part of the **MVP (Minimum Viable Product)**?  
- Prioritize core workflows:
  - Pet intake and profile management
  - Adoption process (application → approval → adoption contract)
  - Pet status updates (in shelter, foster, adopted, medical hold)

---

### 2. Core Responsibilities
1. **Interpret Business Requirements:** Ensure every user story can be implemented technically.  
2. **Model the System:** Identify entities, relationships, and system interactions.  
3. **Define System Boundaries:** Clarify what the Pet Registry System owns vs. external services (e.g., website, veterinarian portal).  
4. **Support Engineering Planning:** Provide enough technical clarity for Software Engineers to design architecture confidently.

---

### 3. System Analysis Tasks

#### a. Create System Context Diagram
- Identify **actors** and **external systems**:  
  - Shelter Worker, Volunteer, Adopter, Vet Partner, Admin, Public Website.  
- Show **data exchanges**:  
  - e.g., Adopter ↔ Pet Registry ↔ Website API.  
- Clearly indicate boundaries: what’s internal vs. external.

#### b. Define Logical Architecture
- Sketch a **high-level architecture** showing main components, e.g.:  
  - Web Frontend (staff & adopter portals)  
  - Backend API / Application Layer  
  - Database Layer  
  - External Integrations (Vet API, Web publishing)  
- Optionally, note technology preferences if provided (e.g., Node.js + PostgreSQL stack).

#### c. Model the Data
- Create a **conceptual entity model** including key entities and relationships:  
  - **Pet (1)** → has many **MedicalRecords**  
  - **Adopter (1)** → may have many **AdoptionApplications**  
  - **Volunteer (1)** → can interact with many **Pets**  
  - **Pet** → belongs to a **Status Category** (In Shelter, Foster, Adopted, Medical Hold)
- Include mandatory and optional attributes for each entity.

#### d. Define Main Workflows
For each user story from the BA team, document **system-level flows**:

**Example:** *Pet Intake Workflow*  
1. Worker submits pet details via intake form.  
2. System validates data and stores it in database.  
3. Status defaults to *In Shelter*.  
4. Pet becomes visible on staff dashboard.

**Example:** *Adoption Workflow*  
1. Adopter submits application.  
2. System links application to Pet and Adopter.  
3. Staff reviews and updates application status.  
4. On approval → Pet status changes to *Adopted* and adoption record generated.

Keep descriptions short and visual (flowchart or sequence diagram if possible).

#### e. Specify Non-Functional Requirements (NFRs)
Define technical constraints and quality expectations:
- **Security:** Authentication for staff, GDPR-compliant data.  
- **Performance:** Record retrieval within 2 seconds.  
- **Usability:** Mobile-first responsive design.  
- **Scalability:** Allow feature expansion (volunteers, donations).  
- **Availability:** Cloud-hosted, >99% uptime target.  

#### f. Identify Integration Points
- External systems or APIs (optional MVP extensions):  
  - Vet record sync.  
  - Website pet listing.  
  - Cloud storage for images.  

---

### 4. Deliverables
By the end of the workshop, the System Analyst team should produce:

| Category | Deliverable |
|-----------|--------------|
| **Architecture** | System context diagram + logical component diagram |
| **Data Model** | Entity-relationship model of main objects |
| **Workflows** | Process or sequence diagrams for core user stories |
| **NFRs** | Documented non-functional requirements |
| **Integration Points** | External systems and data exchange notes |
| **Output Package** | “System Design Handoff” for Software Engineers |

Learn more about prompting from the [Prompting Guide](./sysa-prompting-guide.md)

---

### 5. Handoff to Software Engineers
- Provide your diagrams and notes to the **Software Engineer team**.  
- Engineers will use your materials to:  
  - Validate architecture choices.  
  - Implement database schema and API endpoints.  
  - Follow your workflows for feature logic.  

---

### 6. Optional AI Challenge
Explore how AI tools can accelerate your analysis work:
- Generate ER diagrams from text descriptions.  
- Draft UML or sequence diagrams from user story flows.  
- Ask AI copilots to check completeness of your model (e.g., “what entities are missing?”).  
- Compare human-made and AI-generated diagrams to discuss accuracy and clarity.

---

### 7. Learning Outcomes
After completing this role, participants will be able to:
1. Convert business requirements into system-level artifacts.  
2. Communicate clearly between business and engineering teams.  
3. Apply structured analysis methods (context, data, workflow, NFRs).  
4. Use AI tools responsibly for modeling and documentation.  

---
