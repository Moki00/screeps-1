import SimpleRoomPosition from "./simple-room-position.interface";

export default interface RoomControllerMemory {
  upgradingPosition: SimpleRoomPosition | null;
  previousProgress: number;
  transporterCreepId: string | null;
}
