import { ROOM_SIZE } from "../../utils/constants";

export default function getCenterOfRoom(roomName: string): RoomPosition {
  const size = Math.floor(ROOM_SIZE / 2);
  return new RoomPosition(size, size, roomName);
}
