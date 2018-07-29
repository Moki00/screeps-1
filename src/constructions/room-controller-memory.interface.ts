import SimpleRoomPosition from './simple-room-position.interface';

export default interface RoomControllerMemory {
    upgradingPosition: SimpleRoomPosition | null;
    towerPosition: SimpleRoomPosition | null;
    previousProgress: number;
}
