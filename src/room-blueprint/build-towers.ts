import getAllBuildableRoomPositions from "./helpers/get-all-builable-room-positions";
import sortRoomPositionsByClosestToOtherPositions, {
  ImportantPositionData,
} from "./helpers/sort-room-positions-by-closest-to-other-positions";
import { isPositionBuildable } from "./helpers/is-area-buildable";
import addRoomBlueprintItemByStructure from "./add-room-blueprint-item";
import getMaxStructures from "./helpers/get-max-structures";

function findAllClosestBuildablePositions(
  room: Room,
  otherPositions: ImportantPositionData[]
): RoomPosition[] {
  const positionsSortedByClosest: RoomPosition[] = getAllBuildableRoomPositions(
    room
  )
    .sort(sortRoomPositionsByClosestToOtherPositions(otherPositions))
    .filter((roomPosition) =>
      isPositionBuildable(room, roomPosition.x, roomPosition.y)
    );

  positionsSortedByClosest.length = getMaxStructures(STRUCTURE_TOWER);

  return positionsSortedByClosest;
}

export default function buildTowers(
  room: Room,
  chunksPositionsToCover: RoomPosition[]
): void {
  const towerPositions: RoomPosition[] = findAllClosestBuildablePositions(
    room,
    chunksPositionsToCover.map((chunkRoomPosition) => ({
      roomPosition: chunkRoomPosition,
      importanceMultiplier: 1,
    }))
  );

  towerPositions.forEach((towerPosition) => {
    addRoomBlueprintItemByStructure(towerPosition, STRUCTURE_TOWER);
  });
}
