export default function createTowersContructionSites(
  spawn: StructureSpawn
): void {
  const relativePositions = [
    {
      x: 1,
      y: 1,
    },
    {
      x: -1,
      y: 1,
    },
    {
      x: -1,
      y: -1,
    },
    {
      x: 1,
      y: -1,
    },
  ];
  relativePositions.forEach((relativePosition, towerIndex) => {
    const roomPosition: RoomPosition = new RoomPosition(
      spawn.pos.x + relativePosition.x,
      spawn.pos.y + relativePosition.y,
      spawn.room.name
    );
    spawn.room.createConstructionSite(roomPosition, STRUCTURE_TOWER);
    if (
      spawn.room.controller &&
      towerIndex <
        CONTROLLER_STRUCTURES[STRUCTURE_TOWER][spawn.room.controller.level]
    ) {
      spawn.room.createConstructionSite(roomPosition, STRUCTURE_RAMPART);
    }
  });
}
