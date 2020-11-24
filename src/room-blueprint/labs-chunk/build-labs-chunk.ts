import addRoomBlueprintItemsByLayout from "../helpers/add-room-blueprint-items-by-layout";
import labsChunkLayout from "./labs-chunk-layout";
import findLabsChunkPosition from "./find-labs-chunk-position";

export default function buildLabsChunk(
  room: Room,
  spawnersCorePosition: RoomPosition
): RoomPosition | undefined {
  const topLeftPosition: RoomPosition | undefined = findLabsChunkPosition(
    room,
    spawnersCorePosition
  );

  if (!topLeftPosition) {
    return;
  }

  addRoomBlueprintItemsByLayout(topLeftPosition, labsChunkLayout);

  return topLeftPosition;
}
