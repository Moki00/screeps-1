import sortRoomPositionsByClosestToOtherPositions, {
  ImportantPositionData,
} from "./sort-room-positions-by-closest-to-other-positions";
import getAllBuildableRoomPositions from "./get-all-builable-room-positions";
import { isPositionBuildable } from "./is-area-buildable";

export default function findClosesBuildableRoomPosition(
  room: Room,
  otherPositions: ImportantPositionData
): RoomPosition | undefined {
  return getAllBuildableRoomPositions(room)
    .sort(sortRoomPositionsByClosestToOtherPositions([otherPositions]))
    .filter((roomPosition) =>
      isPositionBuildable(room, roomPosition.x, roomPosition.y)
    )
    .find(() => true);
}
