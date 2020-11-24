import addRoomBlueprintItemByStructure from "./add-room-blueprint-item";
import findClosesBuildableRoomPosition from "./helpers/find-closest-buildable-room-position";

export default function buildObserver(
  room: Room,
  centralPosition: RoomPosition
): void {
  const observerPosition = findClosesBuildableRoomPosition(room, {
    roomPosition: centralPosition,
    importanceMultiplier: 1,
  });

  if (!observerPosition) {
    return;
  }

  addRoomBlueprintItemByStructure(observerPosition, STRUCTURE_OBSERVER);
}
