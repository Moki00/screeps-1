import getAllBuildableRoomPositions from "../helpers/get-all-builable-room-positions";
import { isAreaBuildAbleByTopLeftPosition } from "../helpers/is-area-buildable";
import labsChunkLayout from "./labs-chunk-layout";
import sortRoomPositionsByClosestToOtherPositions from "../helpers/sort-room-positions-by-closest-to-other-positions";
import getCenterOfRoom from "../helpers/get-center-of-room";

export default function findLabsChunkPosition(
  room: Room,
  centralPosition: RoomPosition
): RoomPosition | undefined {
  return getAllBuildableRoomPositions(room)
    .sort(
      sortRoomPositionsByClosestToOtherPositions([
        {
          roomPosition: centralPosition,
          importanceMultiplier: 1,
        },
        {
          roomPosition: getCenterOfRoom(room.name),
          importanceMultiplier: 0.5,
        },
      ])
    )
    .find((buildableRoomPosition) =>
      isAreaBuildAbleByTopLeftPosition(
        buildableRoomPosition,
        labsChunkLayout.size
      )
    );
}
