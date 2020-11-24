import addRoomBlueprintItemByStructure from "../../add-room-blueprint-item";
import Logger from "../../../utils/logger";
import findMineSpecialPositions, {
  MineChunkSpecialPositions,
} from "../find-mine-special-positions";
import findMineral from "../../../utils/find-mineral";

export default function buildMineralMineChunk(
  room: Room,
  centralPosition: RoomPosition
): MineChunkSpecialPositions | undefined {
  const mineral = findMineral(room);
  if (!mineral) {
    return undefined;
  }

  addRoomBlueprintItemByStructure(mineral.pos, STRUCTURE_EXTRACTOR);

  const specialMinesPositions:
    | MineChunkSpecialPositions
    | undefined = findMineSpecialPositions(mineral, centralPosition);

  if (!specialMinesPositions) {
    Logger.warning(`Can't find mineral mine special positions in ${room}`);
    return undefined;
  }

  addRoomBlueprintItemByStructure(
    specialMinesPositions.minerPosition,
    STRUCTURE_CONTAINER
  );
  addRoomBlueprintItemByStructure(
    specialMinesPositions.minerPosition,
    STRUCTURE_RAMPART
  );
  addRoomBlueprintItemByStructure(specialMinesPositions.exit, STRUCTURE_ROAD);

  return specialMinesPositions;
}
