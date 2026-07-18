import { Module } from "@nitrostack/core";

import { OperationsService } from "./operations.service.js";
import { OperationsTools } from "./operations.tools.js";
import { OperationsTaskTools } from "./operations.tasks.js";

@Module({
    name: "operations",
    description: "DRIP Disaster Response Operations Module",

    controllers: [
        OperationsTools,
        OperationsTaskTools,
    ],

    providers: [
        OperationsService,
    ],
})
export class OperationsModule {}