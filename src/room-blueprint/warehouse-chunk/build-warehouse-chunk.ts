import addRoomBlueprintItemsByLayout from "../helpers/add-room-blueprint-items-by-layout";
import warehouseChunkLayout from "./warehouse-chunk-layout";
import findWarehousePosition from "./find-warehouse-position";

export default function buildWarehouseChunk(
  room: Room,
  centralPosition: RoomPosition,
  labsChunkPosition: RoomPosition
): RoomPosition | undefined {
  const topLeftPosition: RoomPosition | undefined = findWarehousePosition(
    room,
    centralPosition,
    labsChunkPosition
  );

  if (!topLeftPosition) {
    return;
  }

  addRoomBlueprintItemsByLayout(topLeftPosition, warehouseChunkLayout);

  return topLeftPosition;
}
