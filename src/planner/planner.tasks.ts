import { Injectable, ToolDecorator as Tool, ExecutionContext, z } from '@nitrostack/core';
import { PlannerService } from './planner.service';

const IncidentSchema = z.object({
  incident: z.string().describe('The raw, natural language report of the emergency incident.'),
});

@Injectable()
export class PlannerTasks {
  constructor(private readonly plannerService: PlannerService) {}

  /**
   * Exposes the Planner's orchestration capabilities to the external MCP client.
   * This is the primary entry point for the User/DEOC to report an incident.
   */
  @Tool({
    name: 'coordinate_disaster_response',
    description: 'Analyzes an emergency incident, dynamically orchestrates necessary intelligence and operational tasks, and generates an authoritative Situation Report.',
    inputSchema: IncidentSchema,
  })
  async coordinateResponse(
    args: z.infer<typeof IncidentSchema>,
    ctx: ExecutionContext
  ): Promise<string> {
    ctx.logger.info(`[PlannerTasks] Tool 'coordinate_disaster_response' invoked.`);
    ctx.logger.info(`[PlannerTasks] Delegating incident to PlannerService for orchestration.`);
    
    // Delegate to the service layer; no orchestration logic lives here.
    const situationReport = await this.plannerService.generateSituationReport(args.incident);
    
    ctx.logger.info(`[PlannerTasks] Orchestration complete. Returning Situation Report to client.`);
    return situationReport;
  }
}