import findInitialExtensionsChunkPosition from "./find-initial-extensions-chunk-position";
import addRoomBlueprintItemsByLayout from "../helpers/add-room-blueprint-items-by-layout";
import extensionsChunkLayout from "./extensions-chunk-layout";
import buildRoadsAroundExtensionsChunk from "./build-roads-around-extensions-chunk";

interface BuildExtensionsChunkReturn {
  position: RoomPosition;
  extensionsAdded: number;
}

export default function buildExtensionsChunk(
  room: Room,
  centralPosition: RoomPosition
): BuildExtensionsChunkReturn | undefined {
  const extensionsChunkTopLeftPosition:
    | RoomPosition
    | undefined = findInitialExtensionsChunkPosition(room, centralPosition);
  if (!extensionsChunkTopLeftPosition) {
    return undefined;
  }

  const stats = addRoomBlueprintItemsByLayout(
    extensionsChunkTopLeftPosition,
    extensionsChunkLayout,
    {
      filterNotBuildable: true,
    }
  );
  buildRoadsAroundExtensionsChunk(extensionsChunkTopLeftPosition);
  return {
    position: extensionsChunkTopLeftPosition,
    extensionsAdded: stats[STRUCTURE_EXTENSION] || 0,
  };
}
