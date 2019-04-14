import RoomControllerMemory from './constructions/room-controller-memory.interface';
import RoomSourcesMemory from './constructions/room-sources-memory.interface';
import SimpleRoomPosition from './constructions/simple-room-position.interface';

declare global {
    interface Memory {
        creeps: { [name: string]: CreepMemory };
        flags: { [name: string]: FlagMemory };
        rooms: { [name: string]: RoomMemory };
        spawns: { [name: string]: SpawnMemory };
        squads?: { [name: string]: SquadMemory };
        tickRateMeter: {
            lastTimestamp: number;
            tickRateHistory: number[]; // in ms
        };
    }

    interface CreepMemory {
        role: string;
        state?: string;
        squadName?: string;
        targetSourceId?: string;
        withdrawTargetId?: string;
        transportFromObjectId?: string;
        transportToObjectId?: string;
    }

    interface RoomMemory {
        sources: RoomSourcesMemory;
        controller: RoomControllerMemory;
        spawnQueue: string[];
    }

    interface SquadMemory {
        name: string;
        type: string;
        state: string;
        createdAt: number;
        createdInRoom: string;
        seats: SquadMemorySeat[];
        targetToKillId?: string;
        targetToHealId?: string;
    }

    interface SquadMemorySeat {
        role: string;
        assignedCreepId?: string;
        recruitmentPosition: SimpleRoomPosition;
    }
}
