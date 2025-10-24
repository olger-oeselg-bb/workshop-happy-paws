# 🤖 Prompting Guide for Business Analysts

## Purpose
This guide helps Business Analysts (BAs) use AI tools effectively to speed up and improve the **analysis and definition of requirements** during the *Happy Paws Shelter – Pet Registry System* workshop.

It supports you through the full BA workflow — from raw stakeholder interviews to clear, testable stories and visuals — while keeping human judgment central.

## Olger's simplified guideline
- My own guideline for prompting is quite simple:
  - You can just start asking the AI assistant different questions or based on input ask it to explain. Then when you have discussed and formulated what you need, you can generate different outputs and when you are happy what that session produced for you, to capture it ask the assistant to create a prompt to use next time.
  - Another option for getting info about prompting is to ask AI assistant, write what you need and ask it to generate prompt for you to use, then in next chat session try to use it together with input data/files.
  - Initially set the tone by using "system prompt": `As a senior system analyst ...`

---

## 1. Analyzing Stakeholder Interviews

### Goal
Extract pain points, needs, and opportunities from messy, realistic interview transcripts.

### Example Prompts
- “Summarize the key pain points and goals mentioned by this stakeholder interview.”  
- “List the top 5 business needs based on this interview transcript.”  
- “Identify repeated themes or problems across all stakeholders.”  
- “Categorize stakeholder feedback by process area: intake, adoption, medical, volunteer.”  

### Tip
Ask AI to detect hidden needs or conflicts:
> “From this transcript, what implicit problems or misalignments between roles can you identify?”

---

## 2. Creating User Stories

### Goal
Transform stakeholder needs into concise, testable user stories.

### Example Prompts
- “Generate user stories in the format *As a [role], I want [goal] so that [benefit]* based on these interview notes.”  
- “Write user stories for an animal shelter’s pet registry MVP covering intake, adoption, and medical record management.”  
- “Refine these user stories to remove ambiguity and make them actionable.”  
- “Suggest which stories should be prioritized for an MVP release.”  

### Tip
Ask AI to cluster stories:
> “Group these user stories into themes like Pet Management, Adoption Workflow, Medical Records, Volunteer Coordination.”

---

## 3. Writing Acceptance Criteria

### Goal
Define clear, testable conditions for each user story.

### Example Prompts
- “Generate acceptance criteria for this user story: *As a shelter worker, I want to register a new pet so that it appears in the system.*”  
- “Write acceptance criteria using Given/When/Then format for an adoption workflow.”  
- “Expand acceptance criteria to include both functional and validation rules.”  
- “Check if these acceptance criteria are testable and measurable.”  

### Tip
Ask AI to help validate completeness:
> “Review these acceptance criteria and suggest any missing edge cases.”

---

## 4. Mapping Business Processes

### Goal
Visualize key workflows (how work currently happens and how it should).

### Example Prompts
- “Describe the current ‘as-is’ adoption process at an animal shelter based on stakeholder feedback.”  
- “Propose a ‘to-be’ process flow for a digital pet registry system.”  
- “Generate a step-by-step list for the pet intake workflow.”  
- “Create a Mermaid process diagram showing the adoption flow from application to approval.”  

### Tip
Use AI for quick process diagram generation:
> “Create a Mermaid flowchart for the shelter’s pet intake process using these steps: intake → medical check → status update → available for adoption.”

---

## 5. Drafting Visuals & Wireframes

### Goal
Use AI to prototype low-fidelity visuals or describe screen layouts quickly. The visuals can be text-based as well, it might be even better sometimes as input for AI.

### Example Prompts
- “Describe the layout of a Pet Profile screen for a shelter management system.”  
- “Generate wireframe suggestions for a mobile-friendly Pet Intake Form.”  
- “List the fields that should appear in an Adoption Application page.”  
- “Suggest navigation flow for users (Dashboard → Pet Profile → Adoption).”  

### Tip
For image-capable AI tools:
> “Create a low-fidelity wireframe of the Pet Intake screen with fields: name, type, age, breed, status, photo upload, save button.”

---

## 6. Prioritizing MVP Scope

### Goal
Decide which features belong to the first release (MVP).

### Example Prompts
- “From this backlog, identify which stories deliver the highest impact with the least complexity.”  
- “Apply MoSCoW prioritization to these user stories.”  
- “Suggest an MVP scope for a shelter registry system with limited budget and staff.”  
- “Explain trade-offs if we exclude the volunteer management feature from MVP.”  

### Tip
Ask AI to estimate effort levels qualitatively:
> “Rate each story as low, medium, or high complexity based on typical web system design.”

---

## 7. Creating Stakeholder Presentation Content

### Goal
Summarize findings and proposals in a clear, business-friendly format.

### Example Prompts
- “Write a short executive summary for stakeholders explaining why the shelter needs a Pet Registry System.”  
- “Create a 3-slide outline: current problems, proposed solution, expected benefits.”  
- “Generate key talking points for a stakeholder meeting presenting the MVP plan.”  
- “Summarize the business value of digitizing pet adoption records.”  

### Tip
Use AI to polish tone and clarity:
> “Rewrite this presentation slide text to sound professional and engaging for non-technical stakeholders.”

---

## 8. Validation & Review Prompts

### Goal
Use AI to review your analysis and find missing elements.

### Example Prompts
- “Evaluate if these user stories align with the shelter’s main goals.”  
- “Identify any stakeholders whose needs are not addressed in these requirements.”  
- “Suggest questions to clarify ambiguous requirements before handoff.”  
- “Review this backlog and recommend improvements for clarity or structure.”  

---

## 9. AI Best Practices for Business Analysts
✅ Always validate outputs against **real business context**.  
✅ Provide **full transcripts or summaries** for best AI results — don’t use isolated quotes.  
✅ Iterate interactively: review, refine, and test prompts.  
✅ Use AI to speed up documentation, not to replace your judgment.  
✅ Record AI-generated insights separately before merging into final backlog.  

---

## Example Comprehensive Prompt

> “You are a Senior Business Analyst helping an animal shelter design a Pet Registry System.  
> Based on the following interview summaries, generate:  
> - 6–8 user stories in *As a [role], I want [goal] so that [benefit]* format,  
> - 3 acceptance criteria for each,  
> - a list of MVP features grouped by theme,  
> - and 2 suggested wireframes (Pet Intake Form and Adoption Application Flow).  
> Present results in Markdown format.”

---

## Outcome
By using this prompting guide, Business Analysts will:
- Extract insights faster and more consistently.  
- Generate structured and testable requirements.  
- Communicate more clearly with System Analysts and Engineers.  
- Leverage AI as a real-time assistant in the analysis workflow.  

---
