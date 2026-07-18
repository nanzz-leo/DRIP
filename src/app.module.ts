import { McpApp, Module, ConfigModule } from '@nitrostack/core';
import { IntelligenceModule } from './modules/intelligence/intelligence.module.js'
/**
 * Root Application Module
 *
 * Disaster Response Intelligence Platform (DRIP)
 * MCP-native emergency coordination platform.
 */
@McpApp({
    module: AppModule,
    server: {
        name: 'drip',
        version: '1.0.0'
    },
    logging: {
        level: 'info'
    }
})
@Module({
    name: 'drip',
    description: 'Disaster Response Intelligence Platform',
    imports: [
        ConfigModule.forRoot(),
        IntelligenceModule
    ],
})
export class AppModule { }
