export default function findMineral(room: Room): Mineral | undefined {
  const minerals: Mineral[] = room.find(FIND_MINERALS);
  return minerals.length ? minerals[0] : undefined;
}
