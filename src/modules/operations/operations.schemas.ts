import { z } from "@nitrostack/core";

export const ReportIncidentSchema = z.object({
  type: z.string().describe("Disaster type"),
  location: z.string().describe("Incident location"),
  severity: z.enum(["Low", "Medium", "High"]),
  description: z.string(),
  peopleAffected: z.number().min(1),
});

export const AllocateRescueSchema = z.object({
  incidentId: z.string(),
});

export const AssignVolunteerSchema = z.object({
  count: z.number().int().min(1),
});

export const RequestSuppliesSchema = z.object({
  food: z.number().min(0),
  water: z.number().min(0),
  medicine: z.number().min(0),
});

export const updateShelterStatusSchema = z.object({
  shelterId: z.string(),
  people: z.number().min(1),
});

export const DispatchEmergencySchema = z.object({
  incidentId: z.string(),
  volunteerCount: z.number().min(1),
  shelterId: z.string(),
  people: z.number().min(1),
  supplies: RequestSuppliesSchema,
});