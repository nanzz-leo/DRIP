import {
  ToolDecorator as Tool,
  ExecutionContext,
  Injectable,
  z,
} from "@nitrostack/core";

import { OperationsService } from "./operations.service.js";
import { DispatchEmergencySchema } from "./operations.schemas.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable({
  deps: [OperationsService],
})
export class OperationsTaskTools {
  constructor(
    private readonly operationsService: OperationsService
  ) {}

  @Tool({
    name: "dispatch_emergency",

    description:
      "Dispatches a complete emergency response workflow. " +
      "This is a long-running operation and should be executed as an MCP Task.",

    inputSchema: DispatchEmergencySchema,

    taskSupport: "required",

    examples: {
      request: {
        incidentId: "INC-1001",
        volunteerCount: 5,
        shelterId: "SHEL-001",
        people: 40,
        supplies: {
          food: 100,
          water: 200,
          medicine: 30,
        },
      },

      response: {
        success: true,
        status: "Emergency Response Initiated",
      },
    },
  })
  async dispatchEmergency(
    args: z.infer<typeof DispatchEmergencySchema>,
    ctx: ExecutionContext
  ) {

    ctx.logger.info("Emergency dispatch started", args);

    // -----------------------------
    // Step 1
    // -----------------------------

    ctx.task?.updateProgress("🚨 Validating incident...");
    await sleep(1000);
    ctx.task?.throwIfCancelled();

    // -----------------------------
    // Step 2
    // -----------------------------

    ctx.task?.updateProgress("🚑 Allocating rescue vehicle...");
    await sleep(1200);
    ctx.task?.throwIfCancelled();

    const rescue =
      this.operationsService.allocateRescue(
        args.incidentId
      );

    // -----------------------------
    // Step 3
    // -----------------------------

    ctx.task?.updateProgress("👨‍🚒 Assigning volunteers...");
    await sleep(1200);
    ctx.task?.throwIfCancelled();

    const volunteers =
      this.operationsService.assignVolunteer(
        args.volunteerCount
      );

    // -----------------------------
    // Step 4
    // -----------------------------

    ctx.task?.updateProgress("📦 Allocating relief supplies...");
    await sleep(1200);
    ctx.task?.throwIfCancelled();

    const inventory =
      this.operationsService.requestSupplies(
        args.supplies
      );

    // -----------------------------
    // Step 5
    // -----------------------------

    ctx.task?.updateProgress("🏠 Updating shelter capacity...");
    await sleep(1000);
    ctx.task?.throwIfCancelled();

    const shelter =
      this.operationsService.updateShelterStatus(
        args.shelterId,
        args.people
      );

    // -----------------------------
    // Step 6
    // -----------------------------

    ctx.task?.updateProgress("✅ Emergency deployment completed.");

    ctx.logger.info("Emergency dispatch completed");

    return {

      success: true,

      incidentId: args.incidentId,

      rescue,

      volunteers,

      inventory,

      shelter,

      completedAt: new Date().toISOString(),

      status: "Emergency Response Initiated",

    };
  }
}