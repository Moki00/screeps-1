import RoomControllerMemory from './constructions/room-controller-memory.interface';
import RoomSourcesMemory from './constructions/room-sources-memory.interface';

declare global {
    interface CreepMemory {
        role: string;
        state?: string;
        targetSourceId?: string;
    }

    interface RoomMemory {
        sources: RoomSourcesMemory;
        controller: RoomControllerMemory;
    }
}
