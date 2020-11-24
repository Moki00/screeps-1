import Logger from "../../../utils/logger";
import addRoomBlueprintItemByStructure from "../../add-room-blueprint-item";
import findSourceMineChunksSpecialPositions from "./find-source-mine-chunks-special-positions";
import findFreePositionsAroundMiner from "../find-free-positions-around-miner";
import { MineChunkSpecialPositions } from "../find-mine-special-positions";
import areMineSpecialPositionsDefined from "../are-mine-special-positions-defined";

function buildSourceMineChunk(
  sourceMineChunkSpecialPositions: MineChunkSpecialPositions
): void {
  addRoomBlueprintItemByStructure(
    sourceMineChunkSpecialPositions.minerPosition,
    STRUCTURE_CONTAINER
  );
  addRoomBlueprintItemByStructure(
    sourceMineChunkSpecialPositions.minerPosition,
    STRUCTURE_RAMPART
  );
  addRoomBlueprintItemByStructure(
    sourceMineChunkSpecialPositions.exit,
    STRUCTURE_ROAD
  );
  const freePositionsAroundMiner: RoomPosition[] = findFreePositionsAroundMiner(
    sourceMineChunkSpecialPositions
  );

  freePositionsAroundMiner.forEach((roomPosition) =>
    addRoomBlueprintItemByStructure(roomPosition, STRUCTURE_RAMPART)
  );

  const linkPosition: RoomPosition | undefined = freePositionsAroundMiner.pop();
  if (!linkPosition) {
    Logger.warning(
      `${sourceMineChunkSpecialPositions.minerPosition} poor mine position. There's no space for LinkStructure.`
    );
    return;
  }
  addRoomBlueprintItemByStructure(linkPosition, STRUCTURE_LINK);
  freePositionsAroundMiner.forEach((roomPosition) => {
    addRoomBlueprintItemByStructure(roomPosition, STRUCTURE_EXTENSION);
  });
}

export default function buildSourceMineChunks(
  room: Room,
  spawnersCorePosition: RoomPosition
): MineChunkSpecialPositions[] {
  const sourceMineChunksSpecialPositions: (
    | MineChunkSpecialPositions
    | undefined
  )[] = findSourceMineChunksSpecialPositions(room, spawnersCorePosition);

  if (!areMineSpecialPositionsDefined(sourceMineChunksSpecialPositions)) {
    Logger.warning(`Can't find source mine special positions in ${room}`);
    return [];
  }

  sourceMineChunksSpecialPositions.forEach((sourceMineChunkSpecialPosition) => {
    buildSourceMineChunk(sourceMineChunkSpecialPosition);
  });

  return sourceMineChunksSpecialPositions;
}
