import addRoomBlueprintItemByStructure from "./add-room-blueprint-item";
import findClosesBuildableRoomPosition from "./helpers/find-closest-buildable-room-position";

export default function buildPowerSpawn(
  room: Room,
  centralPosition: RoomPosition
): void {
  const powerSpawnPosition = findClosesBuildableRoomPosition(room, {
    roomPosition: centralPosition,
    importanceMultiplier: 1,
  });

  if (!powerSpawnPosition) {
    return;
  }

  addRoomBlueprintItemByStructure(powerSpawnPosition, STRUCTURE_POWER_SPAWN);
}
