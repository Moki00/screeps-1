import findMineSpecialPositions, {
  MineChunkSpecialPositions,
} from "../find-mine-special-positions";

export default function findSourceMineChunksSpecialPositions(
  room: Room,
  spawnersCorePosition: RoomPosition
): (MineChunkSpecialPositions | undefined)[] {
  return room
    .find(FIND_SOURCES)
    .map((source) => findMineSpecialPositions(source, spawnersCorePosition));
}
