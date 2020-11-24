import { RoomBlueprintItem } from "./room-blueprint-memory.interface";

export default function addRoomBlueprintItemByStructure(
  { x, y, roomName }: RoomPosition,
  structure: StructureConstant | undefined
): void {
  Memory.rooms[roomName].roomBlueprint?.itemsInBuildOrder.push({
    position: { x, y },
    structure,
  });
}

export function addRoomBlueprintItems(
  room: Room,
  roomBlueprintItems: RoomBlueprintItem[]
): void {
  room.memory.roomBlueprint?.itemsInBuildOrder.push(...roomBlueprintItems);
}
