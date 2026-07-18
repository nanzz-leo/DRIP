/**
 * DRIP Intelligence Module
 *
 * Shared types and API configuration.
 *
 * NOTE:
 * This module DOES NOT own hospitals or shelters.
 * Those belong to the Resource Agent.
 *
 * This module only gathers intelligence from external APIs.
 */

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface WeatherResponse {
    location: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    description: string;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    recommendation: string;
}

export interface Hospital {
    id: string;
    name: string;
    address: string;
    coordinates: Coordinates;
    phone?: string;
    emergencyAvailable?: boolean;
}

export interface Shelter {
    id: string;
    name: string;
    address: string;
    coordinates: Coordinates;
    capacity?: number;
    availableBeds?: number;
}

export interface SafeRoute {
    start: Coordinates;
    destination: Coordinates;
    distanceKm: number;
    durationMinutes: number;
    status: string;
    instructions?: string[];
}

export interface GeocodeResult {
    query: string;
    displayName: string;
    coordinates: Coordinates;
}

export const API_ENDPOINTS = {
    OPENWEATHER: "https://api.openweathermap.org/data/2.5/weather",
    NOMINATIM: "https://nominatim.openstreetmap.org/search",
    OPEN_ROUTE_SERVICE:
        "https://api.openrouteservice.org/v2/directions/driving-car",
};

/**
 * Reads API keys from environment variables.
 *
 * Create a .env file later with:
 *
 * OPENWEATHER_API_KEY=xxxxxxxx
 * OPENROUTESERVICE_API_KEY=xxxxxxxx
 */
export const API_KEYS = Object.freeze({
    openWeather: process.env.OPENWEATHER_API_KEY ?? "",
    openRouteService: process.env.OPENROUTESERVICE_API_KEY ?? "",
});