import { isPositionBuildable } from "../helpers/is-area-buildable";
import { MineChunkSpecialPositions } from "./find-mine-special-positions";

export default function findFreePositionsAroundMiner({
  exit,
  minerPosition,
}: MineChunkSpecialPositions): RoomPosition[] {
  const freePositionsAroundMiner: RoomPosition[] = [];

  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      const iteratedPosition = new RoomPosition(
        minerPosition.x + x,
        minerPosition.y + y,
        minerPosition.roomName
      );
      const isSourceMineChunkSpecialSpot =
        iteratedPosition.isEqualTo(minerPosition) ||
        iteratedPosition.isEqualTo(exit);

      if (
        isPositionBuildable(
          new Room(iteratedPosition.roomName),
          iteratedPosition.x,
          iteratedPosition.y
        ) &&
        !isSourceMineChunkSpecialSpot
      ) {
        freePositionsAroundMiner.push(iteratedPosition);
      }
    }
  }

  return freePositionsAroundMiner;
}
