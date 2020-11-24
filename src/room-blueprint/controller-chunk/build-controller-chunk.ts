import findMineSpecialPositions, {
  MineChunkSpecialPositions,
} from "../mines-chunks/find-mine-special-positions";
import addRoomBlueprintItemByStructure from "../add-room-blueprint-item";
import findFreePositionsAroundMiner from "../mines-chunks/find-free-positions-around-miner";
import Logger from "../../utils/logger";

export default function buildControllerChunk(
  controller: StructureController,
  spawnersCorePosition: RoomPosition
): MineChunkSpecialPositions | undefined {
  const controllerChunkSpecialPositions = findMineSpecialPositions(
    controller,
    spawnersCorePosition
  );

  if (!controllerChunkSpecialPositions) {
    return;
  }

  addRoomBlueprintItemByStructure(
    controllerChunkSpecialPositions.minerPosition,
    STRUCTURE_CONTAINER
  );
  addRoomBlueprintItemByStructure(
    controllerChunkSpecialPositions.minerPosition,
    STRUCTURE_RAMPART
  );
  addRoomBlueprintItemByStructure(
    controllerChunkSpecialPositions.exit,
    STRUCTURE_ROAD
  );
  const freePositionsAroundController: RoomPosition[] = findFreePositionsAroundMiner(
    {
      minerPosition: controller.pos,
      exit: controllerChunkSpecialPositions.exit,
    }
  );

  freePositionsAroundController.forEach((roomPosition) =>
    addRoomBlueprintItemByStructure(roomPosition, STRUCTURE_RAMPART)
  );

  const linkPosition:
    | RoomPosition
    | undefined = freePositionsAroundController.pop();
  if (!linkPosition) {
    Logger.warning(
      `${controllerChunkSpecialPositions.minerPosition} poor controller position. There's no space for LinkStructure.`
    );
    return;
  }
  addRoomBlueprintItemByStructure(linkPosition, STRUCTURE_LINK);
  freePositionsAroundController.forEach((roomPosition) => {
    addRoomBlueprintItemByStructure(roomPosition, STRUCTURE_EXTENSION);
  });

  return controllerChunkSpecialPositions;
}
