import { Injectable } from "@nitrostack/core";

import { IntelligenceService } from "./intelligence.service.js";
import type {
    Coordinates,
    Hospital,
    SafeRoute,
    Shelter,
    WeatherResponse,
} from "./intelligence.data.js";

export interface SituationReport {
    severity: string;
    affectedArea: string;
    hazards: string[];
    weather: WeatherResponse;
    nearestHospital: Hospital;
    nearestShelter: Shelter;
    safeRoute: SafeRoute;
}

@Injectable({
    deps: [IntelligenceService],
})
export class IntelligenceTasks {

    constructor(
        private readonly intelligenceService: IntelligenceService
    ) {}

    /**
     * Planner Task
     *
     * Collects all disaster intelligence for a location
     * and returns a consolidated Situation Report.
     */
    async assessDisaster(
        location: string,
        destination?: Coordinates
    ): Promise<SituationReport> {

        // Step 1: Convert location into coordinates
        const geocode =
            await this.intelligenceService.geocodeLocation(location);

        const coordinates = geocode.coordinates;

        // Step 2: Fetch live weather
        const weather =
            await this.intelligenceService.checkWeather(
                coordinates
            );

        // Step 3: Find nearby hospital
        const hospital =
            await this.intelligenceService.findNearestHospital(
                coordinates
            );

        // Step 4: Find nearby shelter
        const shelter =
            await this.intelligenceService.findNearestShelter(
                coordinates
            );

        // Step 5: Find safe route
        const route =
            await this.intelligenceService.findSafeRoute(
                coordinates,
                destination ?? shelter.coordinates
            );

        // Step 6: Identify hazards
        const hazards: string[] = [];

        if (weather.condition)
            hazards.push(weather.condition);

        if (weather.windSpeed > 12)
            hazards.push("Strong Winds");

        if (weather.humidity > 90)
            hazards.push("High Humidity");

        // Step 7: Determine severity
        let severity = "Low";

        switch (weather.riskLevel) {

            case "HIGH":
                severity = "High";
                break;

            case "MEDIUM":
                severity = "Medium";
                break;

            default:
                severity = "Low";
        }

        // Step 8: Return report
        return {

            severity,

            affectedArea:
                geocode.displayName,

            hazards,

            weather,

            nearestHospital:
                hospital,

            nearestShelter:
                shelter,

            safeRoute:
                route,
        };
    }
}