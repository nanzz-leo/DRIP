export interface Incident {
    id: string;
    type: string;
    location: string;
    severity: "Low" | "Medium" | "High";
    description: string;
    peopleAffected: number;
    status: "Reported" | "Assigned" | "Resolved";
}

export interface Volunteer {
    id: string;
    name: string;
    skills: string[];
    available: boolean;
}

export interface RescueVehicle {
    id: string;
    type: string;
    available: boolean;
    capacity: number;
}

export interface Shelter {
    id: string;
    name: string;
    capacity: number;
    occupied: number;
}

export interface InventoryRequest {
    food: number;
    water: number;
    medicine: number;
}

export interface RescueAllocationSuccess {
  success: true;
  incidentId: string;
  vehicle: RescueVehicle;
  eta: string;
}

export interface RescueAllocationFailure {
  success: false;
  message: string;
}

export type RescueAllocationResult =
  | RescueAllocationSuccess
  | RescueAllocationFailure;