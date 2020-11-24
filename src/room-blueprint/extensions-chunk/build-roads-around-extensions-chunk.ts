import addRoomBlueprintItemsByLayout from "../helpers/add-room-blueprint-items-by-layout";
import extensionsChunkRoadsLayout from "./extensions-chunk-roads-layout";

export default function buildRoadsAroundExtensionsChunk(
  extensionsChunkTopLeftPosition: RoomPosition
): void {
  addRoomBlueprintItemsByLayout(
    extensionsChunkTopLeftPosition,
    extensionsChunkRoadsLayout,
    { filterNotBuildable: true }
  );
}
