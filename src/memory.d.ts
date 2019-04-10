import RoomControllerMemory from './constructions/room-controller-memory.interface';
import RoomSourcesMemory from './constructions/room-sources-memory.interface';

declare global {
    interface Memory {
        [name: string]: any;
        creeps: { [name: string]: CreepMemory };
        flags: { [name: string]: FlagMemory };
        rooms: { [name: string]: RoomMemory };
        spawns: { [name: string]: SpawnMemory };
        tickRateMeter: {
            lastTimestamp: number;
            tickRateHistory: number[]; // in ms
        };
    }

    interface CreepMemory {
        role: string;
        state?: string;
        targetSourceId?: string;
        withdrawTargetId?: string;
        transportFromObjectId?: string;
        transportToObjectId?: string;
    }

    interface RoomMemory {
        sources: RoomSourcesMemory;
        controller: RoomControllerMemory;
    }
}
