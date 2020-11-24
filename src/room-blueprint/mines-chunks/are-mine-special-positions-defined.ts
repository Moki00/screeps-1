import { MineChunkSpecialPositions } from "./find-mine-special-positions";

export default function areMineSpecialPositionsDefined(
  specialPositions: (MineChunkSpecialPositions | undefined)[]
): specialPositions is MineChunkSpecialPositions[] {
  return !specialPositions.find((val) => val === undefined);
}
