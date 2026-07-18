import zones from "../data/zones.json";
import incidents from "../data/incidents.json";
import hospitals from "../data/hospitals.json";
import shelters from "../data/shelters.json";
import warehouses from "../data/warehouses.json";
import vehicles from "../data/vehicles.json";
import volunteers from "../data/volunteers.json";
import emergencyContacts from "../data/emergency_contacts.json";

import type {
    Incident,
    Volunteer,
    RescueVehicle,
    Shelter,
    InventoryRequest
} from "../modules/operations/operations.types";

export class ResourceLocator {

    public locateResources(zoneId: string) {

        const zone = zones.find((z: any) => z.id === zoneId);

        if (!zone) {
            throw new Error(`Zone '${zoneId}' not found.`);
        }

        // ---------------- Incident ----------------

        const incident = incidents.find((i: any) => i.zoneId === zoneId);

        const mappedIncident = incident
            ? {
                  id: incident.id,
                  type: incident.type,
                  location: `${incident.location.lat}, ${incident.location.lng}`,
                  severity:
                      incident.severity === "critical" ||
                      incident.severity === "high"
                          ? "High"
                          : incident.severity === "medium"
                          ? "Medium"
                          : "Low",
                  description: incident.description,
                  peopleAffected: incident.peopleAffected,
                  status:
                      incident.status === "resolved"
                          ? "Resolved"
                          : incident.status === "monitoring"
                          ? "Assigned"
                          : "Reported"
              }
            : null;

        // ---------------- Volunteers ----------------

        const mappedVolunteers = volunteers
            .filter((v: any) => v.zoneId === zoneId)
            .map((v: any) => ({
                id: v.id,
                name: v.name,
                skills: v.skills,
                available: v.status === "available"
            }));

        // ---------------- Vehicles ----------------

        const mappedVehicles = vehicles
            .filter((v: any) => v.zoneId === zoneId)
            .map((v: any) => ({
                id: v.id,
                type: v.type,
                available: v.status === "available",
                capacity: v.capacity.passengers
            }));

        // ---------------- Shelters ----------------

        const mappedShelters = shelters
            .filter((s: any) => s.zoneId === zoneId)
            .map((s: any) => ({
                id: s.id,
                name: s.name,
                capacity: s.capacity,
                occupied: s.currentOccupancy
            }));

        // ---------------- Inventory ----------------

        const mappedInventory = warehouses
            .filter((w: any) => w.zoneId === zoneId)
            .reduce(
                (acc: InventoryRequest, warehouse: any) => {
                    acc.food += warehouse.inventory.foodKits;
                    acc.water += warehouse.inventory.drinkingWaterLiters;
                    acc.medicine += warehouse.inventory.medicalKits;
                    return acc;
                },
                {
                    food: 0,
                    water: 0,
                    medicine: 0
                } as InventoryRequest
            );

        // ---------------- Hospitals ----------------

        const zoneHospitals = hospitals.filter(
            (h: any) => h.zoneId === zoneId
        );

        // ---------------- Emergency Contacts ----------------

        const contacts = emergencyContacts.filter(
            (c: any) => c.zoneId === zoneId || c.zoneId === null
        );

        return {
            zone,
            incident: mappedIncident as Incident | null,
            hospitals: zoneHospitals,
            shelters: mappedShelters as Shelter[],
            inventory: mappedInventory,
            vehicles: mappedVehicles as RescueVehicle[],
            volunteers: mappedVolunteers as Volunteer[],
            emergency_contacts: contacts,
            generatedAt: new Date().toISOString()
        };
    }
}