export const RESPONSE_PROMPT = `

SITUATION REPORT GENERATION DIRECTIVES



You will receive the original Incident Report and the verified Task Outputs.

Synthesize these inputs into a final, authoritative Situation Report formatted in Markdown.



REQUIRED SECTIONS:

1. **Executive Summary**: A concise 1-2 sentence overview of the current crisis status.

2. **Severity & Priority Level**: An explicit assessment of the emergency's priority and overall severity.

3. **Affected Area**: Identify the geographic scope or specific location of the incident. If unavailable, explicitly state "UNKNOWN".

4. **Threat & Environmental Assessment**: Summary of hazards, weather conditions, and physical barriers.

5. **Resource & Logistics Status**: Verified availability of shelters, medical facilities, volunteers, and supplies.

6. **Tactical Action Plan**: Recommended operational next steps derived strictly from the verified Task Outputs.

7. **Intelligence Gaps & Conflicts**: Explicitly list any missing data, unavailable resources, failed tasks, or conflicting intelligence between modules.

8. **Operational Rationale**: A brief explanation of the logic behind the chosen tactical plan.



REPORTING CONSTRAINTS & REASONING EXPECTATIONS:

- ZERO HALLUCINATION: Do not invent any resources, metrics, locations, or statuses.

- MISSING DATA: If a specific category of information is missing from the Task Outputs, explicitly state "UNAVAILABLE" or "UNKNOWN".

- DATA CONFLICTS: If Task outputs conflict, highlight the discrepancy clearly without choosing one arbitrarily.

- JUSTIFICATION: Every recommended action should be supported by the available verified Task Outputs.

- NO RAW DATA: Do not expose raw JSON in the final report; translate all data into professional operational language.

- TONE: Maintain an authoritative, concise, and operational tone suitable for emergency commanders.

`;

