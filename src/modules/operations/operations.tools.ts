import {
  ToolDecorator as Tool,
  ExecutionContext,
  Injectable,
  z,
} from "@nitrostack/core";

import { OperationsService } from "./operations.service.js";

import {
  ReportIncidentSchema,
  AllocateRescueSchema,
  AssignVolunteerSchema,
  RequestSuppliesSchema,
  updateShelterStatusSchema,
} from "./operations.schemas.js";

@Injectable({
  deps: [OperationsService],
})
export class OperationsTools {
  constructor(
    private readonly operationsService: OperationsService
  ) {}

  // =====================================
  // Report Incident
  // =====================================

  @Tool({
    name: "reportincident",
    description: "Report a new disaster incident.",
    inputSchema: ReportIncidentSchema,
    examples: {
      request: {
        type: "Flood",
        location: {"lat": 34.789, "lon": 78.5823 },
        severity: "High",
        description: "Residential area flooded",
        peopleAffected: 120,
      },
      response: {
        success: true,
      },
    },
  })
  async reportIncident(
    args: z.infer<typeof ReportIncidentSchema>,
    ctx: ExecutionContext
  ) {
    ctx.logger.info("Reporting incident", args);

    return this.operationsService.reportIncident(args);
  }

  // =====================================
  // Allocate Rescue
  // =====================================

  @Tool({
    name: "allocateRescue",
    description: "Allocate the nearest available rescue vehicle.",
    inputSchema: AllocateRescueSchema,
    examples: {
      request: {
        incidentId: "INC-1001",
      },
      response: {
        success: true,
      },
    },
  })
  async allocateRescue(
    args: z.infer<typeof AllocateRescueSchema>,
    ctx: ExecutionContext
  ) {
    ctx.logger.info("Allocating rescue", args);

    return this.operationsService.allocateRescue(
      args.incidentId
    );
  }

  // =====================================
  // Assign Volunteers
  // =====================================

  @Tool({
    name: "assignvolunteer",
    description: "Assign available volunteers to an incident.",
    inputSchema: AssignVolunteerSchema,
    examples: {
      request: {
        count: 5,
      },
      response: {
        success: true,
      },
    },
  })
  async assignVolunteer(
    args: z.infer<typeof AssignVolunteerSchema>,
    ctx: ExecutionContext
  ) {
    ctx.logger.info("Assigning volunteers", args);

    return this.operationsService.assignVolunteer(
      args.count
    );
  }

  // =====================================
  // Request Supplies
  // =====================================

  @Tool({
    name: "requestSupplies",
    description: "Allocate relief supplies from inventory.",
    inputSchema: RequestSuppliesSchema,
    examples: {
      request: {
        food: 100,
        water: 200,
        medicine: 50,
      },
      response: {
        success: true,
      },
    },
  })
  async requestSupplies(
    args: z.infer<typeof RequestSuppliesSchema>,
    ctx: ExecutionContext
  ) {
    ctx.logger.info("Requesting supplies", args);

    return this.operationsService.requestSupplies(args);
  }

  // =====================================
  // Update Shelter
  // =====================================

  @Tool({
    name: "updateShelterStatus",
    description: "Update shelter occupancy after relocating victims.",
    inputSchema: updateShelterStatusSchema,
    examples: {
      request: {
        shelterId: "SHEL-001",
        people: 40,
      },
      response: {
        success: true,
      },
    },
  })
  async updateShelterStatus(
    args: z.infer<typeof updateShelterStatusSchema>,
    ctx: ExecutionContext
  ) {
    ctx.logger.info("Updating shelter", args);

    return this.operationsService.updateShelterStatus(
      args.shelterId,
      args.people
    );
  }
}