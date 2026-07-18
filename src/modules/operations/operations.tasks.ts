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
    name: "plan_rescue",

    description:
      "Generates a coordinated rescue plan for a disaster incident. This is a long-running planning task.",

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
        type: "RescuePlan",
        priority: "Immediate",
        estimatedResponseTime: "15 minutes",
        actions: [
          {
            step: 1,
            action: "Deploy Rescue Vehicle",
          },
          {
            step: 2,
            action: "Mobilize Volunteers",
          },
          {
            step: 3,
            action: "Deliver Relief Supplies",
          },
          {
            step: 4,
            action: "Prepare Shelter",
          },
          {
            step: 5,
            action: "Begin Evacuation",
          },
        ],
      },
    },
  })
  async planRescue(
    args: z.infer<typeof DispatchEmergencySchema>,
    ctx: ExecutionContext
  ) {
    ctx.logger.info("Generating rescue plan", args);

    // -----------------------------
    // Analyse Incident
    // -----------------------------

    ctx.task?.updateProgress("🚨 Analysing incident...");
    await sleep(1000);
    ctx.task?.throwIfCancelled();

    // -----------------------------
    // Find Rescue Vehicle
    // -----------------------------

    ctx.task?.updateProgress("🚑 Selecting rescue vehicle...");
    await sleep(1000);
    ctx.task?.throwIfCancelled();

    const rescue = this.operationsService.allocateRescue(args.incidentId);

    if (!rescue.success) {
  return {
    type: "RescuePlan",
    priority: "Critical",
    reason: rescue.message,
    actions: [],
  };
}

console.log(rescue.vehicle.type);


    // -----------------------------
    // Assign Volunteers
    // -----------------------------

    ctx.task?.updateProgress("👨‍🚒 Selecting volunteers...");
    await sleep(1000);
    ctx.task?.throwIfCancelled();

    const volunteers =
      this.operationsService.assignVolunteer(
        args.volunteerCount
      );

    // -----------------------------
    // Allocate Supplies
    // -----------------------------

    ctx.task?.updateProgress("📦 Reserving relief supplies...");
    await sleep(1000);
    ctx.task?.throwIfCancelled();

    const inventory =
      this.operationsService.requestSupplies(
        args.supplies
      );

    // -----------------------------
    // Reserve Shelter
    // -----------------------------

    ctx.task?.updateProgress("🏠 Checking shelter capacity...");
    await sleep(1000);
    ctx.task?.throwIfCancelled();

    const shelter =
      this.operationsService.updateShelterStatus(
        args.shelterId,
        args.people
      );

    // -----------------------------
    // Determine Priority
    // -----------------------------

    let priority = "Low";

    if (args.people >= 100) {
      priority = "Critical";
    } else if (args.people >= 50) {
      priority = "High";
    } else if (args.people >= 20) {
      priority = "Medium";
    }

    ctx.task?.updateProgress("✅ Rescue plan generated.");

    return {
      type: "RescuePlan",

      incidentId: args.incidentId,

      priority,

      estimatedResponseTime: rescue.success
        ? rescue.eta
        : "Unknown",

      actions: [
        {
          step: 1,
          action: rescue.success
            ? `Deploy ${rescue.vehicle.type}`
            : "No rescue vehicle available",
        },
        {
          step: 2,
          action: `Mobilize ${
            volunteers.success
              ? volunteers.volunteers.length
              : 0
          } volunteers`,
        },
        {
          step: 3,
          action: `Deliver ${args.supplies.food} food packets`,
        },
        {
          step: 4,
          action: `Deliver ${args.supplies.water} litres of water`,
        },
        {
          step: 5,
          action: `Deliver ${args.supplies.medicine} medical kits`,
        },
        {
          step: 6,
          action: `Prepare Shelter ${args.shelterId}`,
        },
        {
          step: 7,
          action: `Evacuate ${args.people} civilians`,
        },
      ],

      resources: {
        vehicle: rescue.success ? rescue.vehicle : null,

        volunteers: volunteers.success
          ? volunteers.volunteers
          : [],

        shelter: shelter.success
          ? shelter.shelter
          : null,

        supplies: args.supplies,
      },

      reasoning: [
        "Nearest available rescue vehicle selected.",
        "Available volunteers allocated.",
        "Relief supplies reserved.",
        "Shelter capacity verified.",
        "Response plan generated based on current resource availability.",
      ],

      generatedAt: new Date().toISOString(),
    };
  }
}