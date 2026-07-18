import { Injectable } from "@nitrostack/core";
import fs from "fs";
import path from "path";

import {
  Incident,
  RescueVehicle,
  Volunteer,
  Shelter,
  InventoryRequest,
} from "./operations.types.js";

@Injectable()
export class OperationsService {
  private dataPath = path.join(process.cwd(), "src", "data");

  // ===============================
  // Generic JSON Helpers
  // ===============================

  private readJSON<T>(filename: string): T {
    const file = path.join(this.dataPath, filename);
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  }

  private writeJSON(filename: string, data: unknown): void {
    const file = path.join(this.dataPath, filename);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }

  private generateIncidentId(): string {
    return `INC-${Date.now()}`;
  }

  // ===============================
  // Incident Management
  // ===============================

  reportIncident(
    data: Omit<Incident, "id" | "status" | "timestamp">
  ) {
    const incidents = this.readJSON<Incident[]>("incidents.json");

    const incident: Incident = {
      id: this.generateIncidentId(),
      status: "Reported",
      ...data,
    };

    incidents.push(incident);

    this.writeJSON("incidents.json", incidents);

    return {
      success: true,
      message: "Incident reported successfully.",
      incident,
    };
  }

  getAllIncidents() {
    return this.readJSON<Incident[]>("incidents.json");
  }

  // ===============================
  // Rescue Allocation
  // ===============================

  allocateRescue(incidentId: string) {
    const vehicles =
      this.readJSON<RescueVehicle[]>("vehicles.json");

    const vehicle = vehicles.find((v) => v.available);

    if (!vehicle) {
      return {
        success: false,
        message: "No rescue vehicles available.",
      };
    }

    vehicle.available = false;

    this.writeJSON("vehicles.json", vehicles);

    return {
      success: true,
      incidentId,
      vehicle,
      eta: "15 minutes",
    };
  }

  // ===============================
  // Volunteer Assignment
  // ===============================

  assignVolunteer(count: number) {
    const volunteers =
      this.readJSON<Volunteer[]>("volunteers.json");

    const assigned = volunteers
      .filter((v) => v.available)
      .slice(0, count);

    assigned.forEach((v) => (v.available = false));

    this.writeJSON("volunteers.json", volunteers);

    return {
      success: true,
      volunteers: assigned,
    };
  }

  // ===============================
  // Supplies
  // ===============================

  requestSupplies(request: InventoryRequest) {
    const inventory = this.readJSON<any>("inventory.json");

    inventory.food -= request.food;
    inventory.water -= request.water;
    inventory.medicine -= request.medicine;

    this.writeJSON("inventory.json", inventory);

    return {
      success: true,
      warehouse: "Central Warehouse",
      supplies: request,
      remainingInventory: inventory,
    };
  }

  // ===============================
  // Shelter Management
  // ===============================

  updateShelterStatus(shelterId: string, people: number) {
    const shelters = this.readJSON<any[]>("shelters.json");

    const shelter = shelters.find((s) => s.id === shelterId);

    if (!shelter) {
      return {
        success: false,
        message: "Shelter not found.",
      };
    }

    shelter.occupied += people;

    this.writeJSON("shelters.json", shelters);

    return {
      success: true,
      shelter,
    };
  }

  // ===============================
  // Emergency Workflow
  // ===============================

  dispatchEmergency(
    incidentId: string,
    volunteerCount: number,
    shelterId: string,
    people: number,
    supplies: InventoryRequest
  ) {
    const rescue = this.allocateRescue(incidentId);

    const volunteers = this.assignVolunteer(volunteerCount);

    const inventory = this.requestSupplies(supplies);

    const shelter = this.updateShelterStatus(shelterId, people);

    return {
      success: true,
      incidentId,
      rescue,
      volunteers,
      inventory,
      shelter,
      status: "Emergency Response Initiated",
    };
  }
}