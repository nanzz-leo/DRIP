import { McpApp, Module, ConfigModule } from '@nitrostack/core';
import { PizzazModule } from './modules/pizzaz/pizzaz.module.js';

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
        PizzazModule
    ],
})
export class AppModule { }
