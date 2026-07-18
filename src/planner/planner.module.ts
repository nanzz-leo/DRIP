import { Module } from '@nitrostack/core';
import { PlannerService } from './planner.service.js';
import { PlannerTasks } from './planner.tasks.js';

@Module({
    name: 'planner',
    description: 'Disaster response planning and orchestration module',
    controllers: [PlannerTasks],
    providers: [PlannerService],
})
export class PlannerModule { }