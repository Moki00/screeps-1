import buildExtensionsChunk from "./build-extensions-chunk";
import countExtensionsInCurrentRoomBlueprint from "./count-extensions-in-current-room-blueprint";
import getMaxStructures from "../helpers/get-max-structures";

``;

export default function buildExtensionsChunks(
  room: Room,
  centralPosition: RoomPosition
): void {
  const maxExtensions = getMaxStructures(STRUCTURE_EXTENSION);
  let extensionsCount = countExtensionsInCurrentRoomBlueprint(room) || 0;

  let lastChunkPosition: RoomPosition | undefined = centralPosition;
  while (extensionsCount < maxExtensions) {
    const stats = buildExtensionsChunk(room, lastChunkPosition);
    if (!stats) {
      break;
    }
    lastChunkPosition = stats.position;
    extensionsCount += stats.extensionsAdded;
  }
}
