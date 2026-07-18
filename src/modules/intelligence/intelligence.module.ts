import { Module } from "@nitrostack/core";

import { IntelligenceService } from "./intelligence.service.js";
import { IntelligenceTools } from "./intelligence.tools.js";
import { IntelligenceTasks } from "./intelligence.tasks.js";

@Module({
    name: "intelligence",
    description:
        "Intelligence Agent responsible for collecting live disaster information using external APIs.",

    controllers: [
        IntelligenceTools,
        IntelligenceTasks,
    ],

    providers: [
        IntelligenceService,
    ],
})
export class IntelligenceModule {}