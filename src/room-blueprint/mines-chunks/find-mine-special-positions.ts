import Logger from "../../utils/logger";
import MineChunkSpecialPositions from "./source-mine-chunk/find-source-mine-chunks-special-positions";

export interface MineChunkSpecialPositions {
  minerPosition: RoomPosition;
  exit: RoomPosition;
}

export default function findMineSpecialPositions(
  roomObject: RoomObject,
  spawnersCorePosition: RoomPosition
): MineChunkSpecialPositions | undefined {
  if (!roomObject.room) {
    return undefined;
  }

  const pathSteps: PathStep[] = roomObject.room.findPath(
    roomObject.pos,
    spawnersCorePosition,
    {
      ignoreCreeps: true,
      ignoreDestructibleStructures: true,
      ignoreRoads: true,
    }
  );

  if (!pathSteps[0] && !pathSteps[1]) {
    Logger.warning(
      `Can't find ${roomObject} mine required special spots (${roomObject}, ${roomObject.room})`
    );
    return undefined;
  }

  return {
    minerPosition: new RoomPosition(
      pathSteps[0].x,
      pathSteps[0].y,
      roomObject.room.name
    ),
    exit: new RoomPosition(
      pathSteps[1].x,
      pathSteps[1].y,
      roomObject.room.name
    ),
  };
}
