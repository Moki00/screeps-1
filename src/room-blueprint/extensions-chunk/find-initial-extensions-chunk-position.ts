import getAllBuildableRoomPositions from "../helpers/get-all-builable-room-positions";
import sortRoomPositionsByClosestToOtherPositions from "../helpers/sort-room-positions-by-closest-to-other-positions";
import getCenterOfRoom from "../helpers/get-center-of-room";
import extensionsChunkLayout from "./extensions-chunk-layout";
import getPercentageOfLayoutBeingBuildable from "../helpers/get-percentage-of-layout-being-buildable";

export default function findInitialExtensionsChunkPosition(
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
          importanceMultiplier: 0.2,
        },
      ])
    )
    .find((roomPosition) => {
      const isLayoutAtLeastPartiallyBuildable: boolean =
        getPercentageOfLayoutBeingBuildable(
          roomPosition,
          extensionsChunkLayout
        ) >=
        4 / 5;
      return isLayoutAtLeastPartiallyBuildable;
    });
}
