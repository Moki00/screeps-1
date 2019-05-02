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
        visualsToggles: { [name: string]: boolean };
    }

    interface CreepMemory {
        role: string;
        originRoom: string;
        state?: string;
        squadName?: string;
        targetSourceId?: string;
        withdrawTargetId?: string;
        transportFromObjectId?: string;
        transportToObjectId?: string;
        transportResourcesProgram?: string;
        buildTargetObjectId?: string;
        scoutRoomTarget?: string;
    }

    interface RoomMemory {
        sources: RoomSourcesMemory;
        controller: RoomControllerMemory;
        spawnQueue: string[];
        anotherRoomsHelp: AnotherRoomSettleHelp;
        lastScoutUpdateTick?: number;
        roomsToScout: string[];
    }

    interface AnotherRoomSettleHelp {
        firstSpawnPosition?: SimpleRoomPosition;
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
