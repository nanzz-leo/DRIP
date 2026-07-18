import {
    ToolDecorator as Tool,
    Widget,
    ExecutionContext,
    Injectable,
    z,
} from "@nitrostack/core";
import { IntelligenceService } from "./intelligence.service.js";

@Injectable({
    deps: [IntelligenceService],
})
export class IntelligenceTools {

    constructor(
        private readonly intelligenceService: IntelligenceService
    ) {}

    @Tool({
        name: "geocodeLocation",
        description:
            "Convert a location name or address into geographic coordinates.",
        inputSchema: z.object({
            location: z.string().min(1),
        }),
    })
    async geocodeLocation(
        params: {
            location: string;
        },
        context: ExecutionContext
    ) {

        context.logger.info(
            `Geocoding location: ${params.location}`
        );

        return await this.intelligenceService.geocodeLocation(
            params.location
        );
    }

    @Tool({
        name: "checkWeather",
        description:
            "Retrieve current weather conditions and disaster risk for a location.",
        inputSchema: z.object({
            latitude: z.number(),
            longitude: z.number(),
        }),
    })
    async checkWeather(
        params: {
            latitude: number;
            longitude: number;
        },
        context: ExecutionContext
    ) {

        context.logger.info(
            `Checking weather for (${params.latitude}, ${params.longitude})`
        );

        return await this.intelligenceService.checkWeather({
            latitude: params.latitude,
            longitude: params.longitude,
        });
    }

    @Tool({
        name: "findSafeRoute",
        description:
            "Find the safest available route between two geographic coordinates.",
        inputSchema: z.object({
            startLatitude: z.number(),
            startLongitude: z.number(),
            destinationLatitude: z.number(),
            destinationLongitude: z.number(),
        }),
    })
    async findSafeRoute(
        params: {
            startLatitude: number;
            startLongitude: number;
            destinationLatitude: number;
            destinationLongitude: number;
        },
        context: ExecutionContext
    ) {

        context.logger.info(
            "Finding safe route."
        );

        return await this.intelligenceService.findSafeRoute(
            {
                latitude: params.startLatitude,
                longitude: params.startLongitude,
            },
            {
                latitude: params.destinationLatitude,
                longitude: params.destinationLongitude,
            }
        );
    }

    @Tool({
        name: "findNearestHospital",
        description:
            "Locate the nearest available hospital to the specified coordinates.",
        inputSchema: z.object({
            latitude: z.number(),
            longitude: z.number(),
        }),
    })
    async findNearestHospital(
        params: {
            latitude: number;
            longitude: number;
        },
        context: ExecutionContext
    ) {

        context.logger.info(
            "Finding nearest hospital."
        );

        return await this.intelligenceService.findNearestHospital({
            latitude: params.latitude,
            longitude: params.longitude,
        });
    }

    @Tool({
        name: "findNearestShelter",
        description:
            "Locate the nearest emergency shelter to the specified coordinates.",
        inputSchema: z.object({
            latitude: z.number(),
            longitude: z.number(),
        }),
    })
    async findNearestShelter(
        params: {
            latitude: number;
            longitude: number;
        },
        context: ExecutionContext
    ) {

        context.logger.info(
            "Finding nearest shelter."
        );

        return await this.intelligenceService.findNearestShelter({
            latitude: params.latitude,
            longitude: params.longitude,
        });
    }
}