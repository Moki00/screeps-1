export default function countExtensionsInCurrentRoomBlueprint(
  room: Room
): number | undefined {
  const roomBlueprint = room.memory.roomBlueprint;
  if (!roomBlueprint) {
    return undefined;
  }

  return Object.values(roomBlueprint.itemsInBuildOrder).filter(
    (roomBlueprintItem) => roomBlueprintItem.structure === STRUCTURE_EXTENSION
  ).length;
}
