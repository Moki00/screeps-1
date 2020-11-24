import buildSpawnersCoreChunk from "./spawners-core-chunk/build-spawners-core-chunk";
import Logger from "../utils/logger";
import buildSourceMineChunks from "./mines-chunks/source-mine-chunk/build-source-mine-chunk";
import buildLabsChunk from "./labs-chunk/build-labs-chunk";
import buildMineralMineChunk from "./mines-chunks/mineral-mine-chunk/build-mineral-mine-chunk";
import buildWarehouseChunk from "./warehouse-chunk/build-warehouse-chunk";
import buildRoadConnections from "./roads-connections/build-road-connections";
import buildExtensionsChunks from "./extensions-chunk/build-extensions-chunks";
import buildObserver from "./build-observer";
import buildTowers from "./build-towers";
import buildPowerSpawn from "./build-power-spawn";
import buildControllerChunk from "./controller-chunk/build-controller-chunk";

function initRoomLayoutMemory(room: Room): void {
  room.memory.roomBlueprint = {
    createdAt: Game.time,
    itemsInBuildOrder: [],
  };
}

export default function createRoomBlueprint(room: Room): void {
  initRoomLayoutMemory(room);
  if (!room.controller) {
    Logger.info(`${room} is not suitable to settle.`);
    return;
  }

  const centralSpawnersCoreChunkPosition = buildSpawnersCoreChunk(room);
  if (!centralSpawnersCoreChunkPosition) {
    Logger.info(`${room} is not suitable to settle.`);
    return;
  }

  const specialSourceMinePositions = buildSourceMineChunks(
    room,
    centralSpawnersCoreChunkPosition
  );
  const specialMineralMinePositions = buildMineralMineChunk(
    room,
    centralSpawnersCoreChunkPosition
  );
  buildControllerChunk(room.controller, centralSpawnersCoreChunkPosition);
  buildRoadConnections(room, centralSpawnersCoreChunkPosition, [
    ...specialSourceMinePositions.map(
      (specialMinePosition) => specialMinePosition.exit
    ),
    ...(room.controller ? [room.controller.pos] : []),
    ...(specialMineralMinePositions ? [specialMineralMinePositions.exit] : []),
  ]);
  const labsChunkPosition = buildLabsChunk(
    room,
    centralSpawnersCoreChunkPosition
  );
  if (!labsChunkPosition) {
    Logger.info(`${room} is not suitable to settle.`);
    return;
  }
  const warehouseChunkPosition = buildWarehouseChunk(
    room,
    centralSpawnersCoreChunkPosition,
    labsChunkPosition
  );

  if (!warehouseChunkPosition) {
    Logger.info(`${room} is not suitable to settle.`);
    return;
  }

  buildTowers(room, [
    centralSpawnersCoreChunkPosition,
    labsChunkPosition,
    warehouseChunkPosition,
  ]);

  buildObserver(room, centralSpawnersCoreChunkPosition);
  buildExtensionsChunks(room, centralSpawnersCoreChunkPosition);
  buildPowerSpawn(room, centralSpawnersCoreChunkPosition);

  Logger.info(`${room} blueprint has been created.`);
}
