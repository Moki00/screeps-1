import getAllBuildableRoomPositions from "../helpers/get-all-builable-room-positions";
import sortRoomPositionsByClosestToOtherPositions from "../helpers/sort-room-positions-by-closest-to-other-positions";
import { isAreaBuildAbleByTopLeftPosition } from "../helpers/is-area-buildable";
import warehouseChunkLayout from "./warehouse-chunk-layout";
import getCenterOfRoom from "../helpers/get-center-of-room";

export default function findWarehousePosition(
  room: Room,
  centralPosition: RoomPosition,
  labsChunkPosition: RoomPosition
): RoomPosition | undefined {
  return getAllBuildableRoomPositions(room)
    .sort(
      sortRoomPositionsByClosestToOtherPositions([
        {
          roomPosition: centralPosition,
          importanceMultiplier: 1,
        },
        {
          roomPosition: labsChunkPosition,
          importanceMultiplier: 1,
        },
        {
          roomPosition: getCenterOfRoom(room.name),
          importanceMultiplier: 0.2,
        },
      ])
    )
    .find((buildableRoomPosition) =>
      isAreaBuildAbleByTopLeftPosition(
        buildableRoomPosition,
        warehouseChunkLayout.size
      )
    );
}
