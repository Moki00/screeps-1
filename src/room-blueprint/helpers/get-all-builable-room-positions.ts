import { ROOM_SIZE } from "../../utils/constants";
import { isPositionBuildable } from "./is-area-buildable";

export default function getAllBuildableRoomPositions(
  room: Room
): RoomPosition[] {
  const allBuildableRoomPositions: RoomPosition[] = [];

  for (let y = 0; y < ROOM_SIZE; y++) {
    for (let x = 0; x < ROOM_SIZE; x++) {
      if (isPositionBuildable(room, x, y)) {
        allBuildableRoomPositions.push(new RoomPosition(x, y, room.name));
      }
    }
  }

  return allBuildableRoomPositions;
}
