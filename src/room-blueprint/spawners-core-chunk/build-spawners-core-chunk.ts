import findCentralPositionToSpawn from "./find-central-point-to-spawn";
import spawnersCoreChunk from "./spawners-core-layout";
import addRoomBlueprintItemsByLayout from "../helpers/add-room-blueprint-items-by-layout";

export default function buildSpawnersCoreChunk(
  room: Room
): RoomPosition | undefined {
  const centralPoint: RoomPosition | undefined = findCentralPositionToSpawn(
    room
  );
  if (!centralPoint) {
    return undefined;
  }

  const topLeftPosition: RoomPosition = new RoomPosition(
    centralPoint.x - Math.floor(spawnersCoreChunk.size.width / 2),
    centralPoint.y - Math.floor(spawnersCoreChunk.size.height / 2),
    room.name
  );

  addRoomBlueprintItemsByLayout(topLeftPosition, spawnersCoreChunk);

  return centralPoint;
}
