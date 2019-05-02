import SimpleRoomPosition from './simple-room-position.interface';

export default interface SourceMemory {
    sourceId: string;
    harvesterCreepId: string | null;
    transporterCreepId: string | null;
    harvestingPosition: SimpleRoomPosition | null;
}
