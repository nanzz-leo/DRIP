import { Injectable } from '@nitrostack/core';
import {
    API_ENDPOINTS,
    API_KEYS,
    type Coordinates,
    type GeocodeResult,
    type SafeRoute,
    type WeatherResponse,
    type Hospital,
    type Shelter,
} from './intelligence.data.js';

@Injectable()
export class IntelligenceService {

    /**
     * Generic helper for fetching JSON data from external APIs.
     */
    private async fetchJson<T>(
        url: string,
        options?: RequestInit
    ): Promise<T> {

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(
                `External API request failed (${response.status} ${response.statusText})`
            );
        }

        return await response.json() as T;
    }

    /**
     * Determine disaster risk based on current weather.
     */
    private determineRiskLevel(
        condition: string,
        windSpeed: number
    ): "LOW" | "MEDIUM" | "HIGH" {

        const weather = condition.toLowerCase();

        if (
            weather.includes("thunder") ||
            weather.includes("storm") ||
            weather.includes("tornado")
        ) {
            return "HIGH";
        }

        if (
            weather.includes("rain") ||
            weather.includes("snow") ||
            weather.includes("drizzle") ||
            windSpeed >= 12
        ) {
            return "MEDIUM";
        }

        return "LOW";
    }

    /**
     * Generate a human-friendly recommendation.
     */
    private generateRecommendation(
        risk: "LOW" | "MEDIUM" | "HIGH"
    ): string {

        switch (risk) {

            case "HIGH":
                return "Avoid unnecessary travel. Follow emergency advisories and move to a safe shelter if instructed.";

            case "MEDIUM":
                return "Exercise caution while travelling. Monitor official weather updates regularly.";

            default:
                return "Weather conditions are stable. Continue monitoring for any sudden changes.";
        }
    }

    /**
     * Convert an address or place name into coordinates.
     */
    async geocodeLocation(
        location: string
    ): Promise<GeocodeResult> {

        const url =
            `${API_ENDPOINTS.NOMINATIM}` +
            `?q=${encodeURIComponent(location)}` +
            `&format=json&limit=1`;

        const results = await this.fetchJson<any[]>(url, {
            headers: {
                "User-Agent": "DRIP-Intelligence-Agent"
            }
        });

        if (!results.length) {
            throw new Error(
                `Unable to locate "${location}".`
            );
        }

        const result = results[0];

        return {
            query: location,
            displayName: result.display_name,
            coordinates: {
                latitude: Number(result.lat),
                longitude: Number(result.lon),
            },
        };
    }

    /**
     * Retrieve live weather information using OpenWeather.
     */
    async checkWeather(
        coordinates: Coordinates
    ): Promise<WeatherResponse> {

        if (!API_KEYS.openWeather) {
            throw new Error(
                "OPENWEATHER_API_KEY is missing."
            );
        }

        const url =
            `${API_ENDPOINTS.OPENWEATHER}` +
            `?lat=${coordinates.latitude}` +
            `&lon=${coordinates.longitude}` +
            `&units=metric` +
            `&appid=${API_KEYS.openWeather}`;

        const weather = await this.fetchJson<any>(url);

        const condition =
            weather.weather?.[0]?.main ?? "Unknown";

        const description =
            weather.weather?.[0]?.description ?? "";

        const windSpeed =
            weather.wind?.speed ?? 0;

        const risk =
            this.determineRiskLevel(
                condition,
                windSpeed
            );

        return {

            location: weather.name,

            temperature: weather.main.temp,

            feelsLike: weather.main.feels_like,

            humidity: weather.main.humidity,

            windSpeed,

            condition,

            description,

            riskLevel: risk,

            recommendation:
                this.generateRecommendation(risk),
        };
    }

    /**
     * Calculate the safest available route using
     * OpenRouteService.
     */
    async findSafeRoute(
        start: Coordinates,
        destination: Coordinates
    ): Promise<SafeRoute> {

        if (!API_KEYS.openRouteService) {
            throw new Error(
                "OPENROUTESERVICE_API_KEY is missing."
            );
        }

        const body = {
            coordinates: [
                [
                    start.longitude,
                    start.latitude,
                ],
                [
                    destination.longitude,
                    destination.latitude,
                ],
            ],
        };

        const response = await this.fetchJson<any>(
            API_ENDPOINTS.OPEN_ROUTE_SERVICE,
            {
                method: "POST",

                headers: {
                    Authorization:
                        API_KEYS.openRouteService,
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify(body),
            }
        );

        const route =
            response.routes?.[0];

        if (!route) {
            throw new Error(
                "No valid route could be generated."
            );
        }

        const summary =
            route.summary;

                    return {
            start,
            destination,
            distanceKm: Number((summary.distance / 1000).toFixed(2)),
            durationMinutes: Math.ceil(summary.duration / 60),
            status: "SAFE",
            instructions:
                route.segments?.[0]?.steps?.map(
                    (step: any) => step.instruction
                ) ?? [],
        };
    }

    /**
     * Finds the nearest hospital.
     *
     * NOTE:
     * Hospital data belongs to the Resource Agent.
     * This service only provides the integration point.
     */
    async findNearestHospital(
        coordinates: Coordinates
    ): Promise<Hospital> {

        /**
         * TODO (Resource Agent Integration)
         *
         * Replace this placeholder with the Resource
         * Agent's MCP Resource/API once available.
         */

        throw new Error(
            "Hospital lookup is awaiting Resource Agent integration."
        );
    }

    /**
     * Finds the nearest shelter.
     *
     * NOTE:
     * Shelter data belongs to the Resource Agent.
     */
    async findNearestShelter(
        coordinates: Coordinates
    ): Promise<Shelter> {

        /**
         * TODO (Resource Agent Integration)
         */

        throw new Error(
            "Shelter lookup is awaiting Resource Agent integration."
        );
    }

    /**
     * Calculates the Haversine distance between
     * two coordinate pairs.
     */
    private calculateDistance(
        pointA: Coordinates,
        pointB: Coordinates
    ): number {

        const earthRadius = 6371;

        const toRadians = (degrees: number) =>
            degrees * (Math.PI / 180);

        const latitudeDifference =
            toRadians(
                pointB.latitude - pointA.latitude
            );

        const longitudeDifference =
            toRadians(
                pointB.longitude - pointA.longitude
            );

        const a =
            Math.sin(latitudeDifference / 2) *
                Math.sin(latitudeDifference / 2) +
            Math.cos(toRadians(pointA.latitude)) *
                Math.cos(toRadians(pointB.latitude)) *
                Math.sin(longitudeDifference / 2) *
                Math.sin(longitudeDifference / 2);

        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );

        return earthRadius * c;
    }
}