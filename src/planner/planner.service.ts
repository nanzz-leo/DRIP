import { Injectable } from '@nitrostack/core';
import { LLMService } from '../services/llm';
import { PLANNER_SYSTEM_PROMPT } from '../prompts/systemPrompt';
import { RESPONSE_PROMPT } from '../prompts/responsePrompt';
// import { IntelligenceTasks } from '../modules/intelligence/intelligence.tasks'; //

@Injectable()
export class PlannerService {
  constructor(
    private readonly llmService: LLMService,
    // private readonly intelligenceTasks: IntelligenceTasks //
  ) {}

  /**
   * Main entry point for the Planner. Orchestrates the entire incident response workflow.
   * @param incident The raw emergency incident reported by the user.
   * @returns The generated Situation Report formatted in Markdown.
   */
  async generateSituationReport(incident: string): Promise<string> {
    console.log(`[PlannerService] Received incident report. Initiating Planner workflow.`);

    // 1. Analyze the incident
    const incidentType = this.analyzeIncident(incident);
    console.log(`[PlannerService] Incident categorized as: ${incidentType.toUpperCase()}`);

    // 2. Select required Tasks deterministically
    const selectedTasks = this.selectTasks(incidentType);
    console.log(`[PlannerService] Selected Tasks: ${selectedTasks.join(', ')}`);

    // 3. Extract location for targeted intelligence gathering
    const location = this.extractLocation(incident);
    console.log(`[PlannerService] Extracted location for assessment: ${location}`);

    // 4. Execute the selected Tasks
    const taskOutputs = await this.executeTasks(selectedTasks, location);

    // 5. Build the contextual prompt
    const userPrompt = this.buildPrompt(incident, taskOutputs);

    // 6. Generate the final Situation Report via LLMService
    console.log(`[PlannerService] Requesting final Situation Report synthesis from LLM.`);
    const result = await this.llmService.generateCompletion(
      PLANNER_SYSTEM_PROMPT,
      userPrompt
    );

    if (!result.success || !result.response) {
      console.error(`[PlannerService] LLM synthesis failed: ${result.error}`);
      return `SYSTEM ALERT: Failed to generate Situation Report. Error: ${result.error}`;
    }

    console.log(`[PlannerService] Situation Report successfully generated.`);
    return result.response;
  }

  /**
   * Deterministically analyzes the incident text to determine the disaster type.
   */
  private analyzeIncident(incident: string): string {
    const lowerIncident = incident.toLowerCase();
    
    if (lowerIncident.includes('flood')) return 'flood';
    if (lowerIncident.includes('fire')) return 'fire';
    if (lowerIncident.includes('earthquake')) return 'earthquake';
    if (lowerIncident.includes('cyclone')) return 'cyclone';
    
    return 'unknown';
  }

  /**
   * Selects the minimum necessary tasks based on the categorized incident type.
   */
  private selectTasks(incidentType: string): string[] {
    switch (incidentType) {
      case 'flood':
      case 'earthquake':
        return ['AssessDisaster', 'LocateResources', 'PlanRescue'];
      case 'fire':
        return ['AssessDisaster', 'PlanRescue'];
      case 'cyclone':
        return ['AssessDisaster', 'LocateResources'];
      default:
        // Default to safe assessment for unknown incidents
        return ['AssessDisaster'];
    }
  }

  /**
   * Deterministically extracts the geographic location using keyword and regex parsing.
   */
  private extractLocation(incident: string): string {
    // Regex patterns to capture locations following common prepositions
    const patterns = [
      /(?:near|in|at|around|towards)\s+([A-Z][a-zA-Z\s]+?)(?:\b(?:is|has|was|are|and|with)\b|[.,;!?]|$)/,
      /(?:near|in|at|around|towards)\s+([a-zA-Z\s]+?)(?:\b(?:is|has|was|are|and|with)\b|[.,;!?]|$)/i,
      /(?:sector|zone|area)\s+([a-zA-Z0-9\-]+)/i
    ];

    for (const pattern of patterns) {
      const match = incident.match(pattern);
      if (match && match[1]) {
        const extracted = match[1].trim();
        if (extracted.length > 0) {
          return extracted;
        }
      }
    }

    return 'UNKNOWN';
  }

  /**
   * Executes the required tasks and aggregates their outputs.
   * 
   * @param tasks The array of task names to execute.
   * @param location The extracted location string for the Intelligence Task.
   */
  private async executeTasks(tasks: string[], location: string): Promise<Record<string, any>> {
    const outputs: Record<string, any> = {};

    for (const task of tasks) {
      console.log(`[PlannerService] Executing task: ${task}`);
      switch (task) {
        case 'AssessDisaster':
          // Using the real injected implementation, passing ONLY the location string
          //outputs['AssessDisaster'] = await this.intelligenceTasks.assessDisaster(location);//
          break;
        case 'LocateResources':
          outputs['LocateResources'] = await this.mockLocateResources();
          break;
        case 'PlanRescue':
          outputs['PlanRescue'] = await this.mockPlanRescue();
          break;
      }
    }

    return outputs;
  }

  /**
   * Constructs the final user prompt by combining the response directives, 
   * the original incident, and the aggregated task intelligence.
   */
  private buildPrompt(incident: string, taskOutputs: Record<string, any>): string {
    return `
${RESPONSE_PROMPT}

---

**REPORTED INCIDENT:**
${incident}

**VERIFIED TASK OUTPUTS:**
${JSON.stringify(taskOutputs, null, 2)}
`;
  }

  // ====================================================================
  // MOCKED TASK IMPLEMENTATIONS
  // These will be replaced by actual teammate implementations later.
  // ====================================================================

  private async mockLocateResources(): Promise<any> {
    return {
      status: "SUCCESS",
      shelters: [
        { name: "Community Center", capacity: 200, currentOccupancy: 45 }
      ],
      vehicles: { availableAmbulances: 3, availableRescueBoats: 2 },
      inventory: { waterBottles: 500, medicalKits: 50 },
      volunteers: 12
    };
  }

  private async mockPlanRescue(): Promise<any> {
    return {
      status: "SUCCESS",
      recommendedAction: "Deploy 2 rescue boats to flooded sector.",
      volunteerAllocation: "Assign 4 volunteers to Community Center for intake.",
      logistics: "Dispatch 1 ambulance to standby at North Ridge."
    };
  }
}