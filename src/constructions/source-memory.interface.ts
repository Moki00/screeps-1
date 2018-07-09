import SimpleRoomPosition from './simple-room-position.interface';

export default interface SourceMemory {
    sourceId: string;
    occupiedByCreepId: string | null;
    harvestingPosition: SimpleRoomPosition | null;
    towerPosition: SimpleRoomPosition | null;
}
