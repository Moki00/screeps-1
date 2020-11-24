import findCentralPositionBetweenRoomObjects from "../helpers/find-central-position-between-room-objects";
import { isAreaBuildableByCenterPosition } from "../helpers/is-area-buildable";
import getAllBuildableRoomPositions from "../helpers/get-all-builable-room-positions";
import sortRoomPositionsByClosestToOtherPositions from "../helpers/sort-room-positions-by-closest-to-other-positions";
import getCenterOfRoom from "../helpers/get-center-of-room";

export default function findCentralPositionToSpawn(
  room: Room
): RoomPosition | undefined {
  const sources: Source[] = room.find(FIND_SOURCES);

  if (!sources) {
    return undefined;
  }

  if (!room.controller) {
    return undefined;
  }

  const perfectCentralPosition = findCentralPositionBetweenRoomObjects([
    ...sources,
    room.controller,
  ]);
  if (!perfectCentralPosition) {
    return undefined;
  }

  const allBuildableRoomPositions: RoomPosition[] = getAllBuildableRoomPositions(
    room
  );

  allBuildableRoomPositions.sort(
    sortRoomPositionsByClosestToOtherPositions([
      {
        roomPosition: perfectCentralPosition,
        importanceMultiplier: 1,
      },
      {
        roomPosition: getCenterOfRoom(room.name),
        importanceMultiplier: 0.5,
      },
      {
        roomPosition: room.controller.pos,
        importanceMultiplier: 0.1,
      },
    ])
  );
  const optimalPosition = allBuildableRoomPositions.find((roomPosition) =>
    isAreaBuildableByCenterPosition(roomPosition, { width: 7, height: 7 })
  );

  if (!optimalPosition) {
    return undefined;
  }

  return optimalPosition;
}
