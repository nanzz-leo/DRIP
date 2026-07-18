#  DRIP – Disaster Response Intelligence Platform

> AI-powered emergency coordination platform built with NitroStack MCP to accelerate disaster response through intelligent planning, resource orchestration, and real-time operational insights.

##  Overview

DRIP (Disaster Response Intelligence Platform) is an AI-driven emergency response system designed to assist Disaster Management Authorities, Emergency Operations Centers (EOCs), first responders, and relief organizations.

Instead of relying on fragmented information and manual coordination, DRIP orchestrates specialized intelligence modules to:

- Assess disaster severity
- Analyze environmental conditions
- Locate critical resources
- Coordinate rescue operations
- Generate actionable Situation Reports for decision makers

Built using **NitroStack MCP**, DRIP exposes intelligent tools that can be orchestrated by AI agents to support emergency response workflows.

---

# Features

## AI Planner

- Intelligent incident analysis
- Dynamic task selection
- LLM-powered Situation Report generation
- Minimal task execution strategy
- Hallucination-resistant reporting

---

## Intelligence Module

Provides:

- Weather assessment
- Hazard analysis
- Safe route identification
- Nearest hospital discovery
- Shelter discovery
- Severity estimation

---

## Operations Module

Coordinates operational response:

- Incident reporting
- Rescue vehicle allocation
- Volunteer assignment
- Shelter updates
- Relief inventory management
- Emergency deployment workflow

---

## Situation Reports

Automatically generates structured operational reports including:

- Executive Summary
- Severity Assessment
- Affected Area
- Threat Analysis
- Resource Status
- Tactical Action Plan
- Intelligence Gaps
- Operational Rationale

---

# Architecture

```
                    User Incident
                          │
                          ▼
                 Planner Orchestrator
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
   Intelligence     Resources      Operations
          │               │               │
          └───────────────┼───────────────┘
                          ▼
               AI Situation Report
```

---

# Built With

- NitroStack MCP
- TypeScript
- Node.js
- NitroCloud
- Gemini API
- Zod
- Mapbox (Widgets)

---

# Project Structure

```
src
│
├── planner/
│   ├── planner.module.ts
│   ├── planner.service.ts
│   └── planner.tasks.ts
│
├── modules/
│   ├── intelligence/
│   ├── operations/
│   ├── resources/
│   └── pizzaz/
│
├── prompts/
│   ├── systemPrompt.ts
│   └── responsePrompt.ts
│
├── services/
│   └── llm.ts
│
└── app.module.ts
```

---

# Running Locally

```bash
git clone https://github.com/nanzz-leo/DRIP.git

cd DRIP

npm install

npm run build

npm run dev
```

---

# Example Workflow

```
Incident Report
        │
        ▼
Planner analyzes incident
        │
        ▼
Assess Disaster
        │
        ▼
Locate Resources
        │
        ▼
Plan Rescue
        │
        ▼
Generate AI Situation Report
```

---

# Design Principles

- Human life first
- Verified information only
- Zero hallucination policy
- Modular AI orchestration
- MCP-native architecture
- Extensible task-based design

---

# Team

Built during the **NitroStack × Amrita University Hackathon**.

