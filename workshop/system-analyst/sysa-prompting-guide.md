# Prompting Guide for System Analysts

## Purpose
This guide helps System Analysts use AI tools effectively to support their analysis work during the **Pet Registry System** workshop.  
You can use these prompts in ChatGPT, Copilot, or similar tools to accelerate modeling, documentation, and validation — while still applying your own analytical judgment.

## Olger's simplified guideline
- My own guideline for prompting is quite simple:
  - You can just start asking the AI assistant different questions or based on input ask it to explain. Then when you have discussed and formulated what you need, you can generate different outputs and when you are happy what that session produced for you, to capture it ask the assistant to create a prompt to use next time.
  - Another option for getting info about prompting is to ask AI assistant, write what you need and ask it to generate prompt for you to use, then in next chat session try to use it together with input data/files.
  - Initially set the tone by using "system prompt": `As a senior system analyst ...`

---

## 1. System Context Diagram Prompts

### Goal
Identify all actors, systems, and data exchanges that interact with the Pet Registry System.

### Example Prompts
- “List all internal and external actors for a pet registry system in an animal shelter.”  
- “Generate a text-based system context diagram for a pet registry that includes shelter staff, adopters, veterinarians, and a public website.”  
- “Describe data flows between the Pet Registry backend, staff dashboard, and external website.”  
- “Summarize which actors belong *inside* the system boundary and which are *external*.”  

### Tip
Ask AI to produce a **PlantUML** or **Mermaid** diagram for quick visualization:
> “Create a Mermaid system context diagram showing relationships between the Pet Registry, Adopter, Veterinarian, and Website.”

---

## 2. Logical Architecture Prompts

### Goal
Define the high-level structure of the system — components, layers, and responsibilities.

### Example Prompts
- “Propose a 3-tier architecture for a small web-based pet registry system (frontend, backend, database).”  
- “List possible backend services and their responsibilities for a pet registry MVP.”  
- “Describe how an animal shelter’s pet registry could be structured using Node.js, PostgreSQL, and a REST API.”  
- “Generate a component diagram for a pet registry showing major modules (intake, adoption, medical records).”  

### Tip
Ask the AI to justify trade-offs:
> “Compare REST vs GraphQL for a small pet registry system and recommend which to use.”

---

## 3. Data Modeling Prompts

### Goal
Identify entities, relationships, and attributes for the Pet Registry’s conceptual data model.

### Example Prompts
- “List the main entities and their attributes for a pet registry system used by an animal shelter.”  
- “Create an entity-relationship model (ERD) for pets, adopters, volunteers, and medical records.”  
- “Describe relationships (1-to-many, many-to-many) among entities in a pet registry.”  
- “Provide SQL-like table definitions for these entities as a prototype schema.”  

### Tip
Ask AI to visualize it:
> “Generate a Mermaid ER diagram for the pet registry system with entities Pet, Adopter, Volunteer, and MedicalRecord.”

---

## 4. System Workflow Prompts

### Goal
Describe step-by-step how the system handles key processes: intake, status update, adoption, and medical record update.

### Example Prompts
- “Explain the system-level workflow for registering a new pet.”  
- “Write a sequence diagram showing how an adoption application moves from submission to approval.”  
- “Outline the data validation process during pet intake in a shelter system.”  
- “Describe what happens when a vet adds a new medical record to a pet’s profile.”  

### Tip
Use AI to generate visual diagrams:
> “Create a Mermaid sequence diagram for the adoption workflow in a pet registry system.”

---

## 5. Non-Functional Requirements (NFR) Prompts

### Goal
Define quality attributes, constraints, and expectations for system behavior.

### Example Prompts
- “List common non-functional requirements for a small web application used by an animal shelter.”  
- “Suggest security and privacy requirements to make a pet registry GDPR-compliant.”  
- “Write measurable NFRs for usability, performance, and availability for this MVP system.”  
- “Generate a short table of NFRs with metrics (e.g., page load time, uptime, response time).”  

### Tip
Ask AI to review completeness:
> “Based on this system description, what NFRs might be missing?”  

---

## 6. Integration Point Prompts

### Goal
Identify external systems and describe how data could flow between them and the Pet Registry.

### Example Prompts
- “What external systems might a pet registry integrate with?”  
- “Describe how a vet clinic system could share vaccination data with the shelter registry.”  
- “Propose an API endpoint structure for syncing available pets to a public website.”  
- “Write an example JSON payload for posting new pet data to an external website.”  

---

## 7. Validation & Review Prompts

### Goal
Validate the completeness and clarity of your analysis.

### Example Prompts
- “Review this system model and identify inconsistencies or missing relationships.”  
- “Evaluate if this architecture fits the functional scope of a small nonprofit shelter.”  
- “Summarize potential risks or technical constraints in this system design.”  
- “Suggest one improvement to make this system more scalable or maintainable.”  

---

## 8. AI Best Practices for System Analysts
✅ Use AI for **speed**, not for final design — always validate outputs manually.  
✅ Provide **context-rich prompts** — mention the organization, goals, and MVP scope.  
✅ Iterate — refine one section (e.g., data model) before generating visuals.  
✅ Ask AI to produce both **visual diagrams** and **explanatory text** for better comprehension.  
✅ Keep a record of AI-generated diagrams and rationale to include in your final handoff.  

---

## Example Comprehensive Prompt

> “You are acting as a system analyst. Based on these user stories for the Happy Paws Pet Registry System (pet intake, adoption workflow, medical record tracking), create:
> - a system context diagram showing main actors and data flows,  
> - a logical architecture (frontend, backend, database),  
> - an entity relationship model,  
> - and list non-functional requirements such as performance, security, and usability.  
> Output diagrams in Mermaid format where possible.”

---

## Outcome
By using this prompting guide, System Analysts can:
- Generate technical artifacts faster.  
- Improve completeness of analysis.  
- Enhance clarity of handoffs to engineers.  
- Demonstrate effective human–AI collaboration in real-world system design.  

---
