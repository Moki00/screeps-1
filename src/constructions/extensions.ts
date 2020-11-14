export default function createExtensionsContructionSites(room: Room): void {
  const spawns: StructureSpawn[] = room.find(FIND_MY_SPAWNS);

  spawns.forEach((spawn) => {
    extensionsRelativePositions.forEach((extensionRelativePosition) => {
      const extensionPosition: RoomPosition = new RoomPosition(
        spawn.pos.x + extensionRelativePosition.x,
        spawn.pos.y + extensionRelativePosition.y,
        spawn.room.name
      );
      spawn.room.createConstructionSite(extensionPosition, STRUCTURE_EXTENSION);
    });
  });
}

// TODO: think of some fancy formula for this
const extensionsRelativePositions: Array<{ x: number; y: number }> = [
  {
    x: 0,
    y: -2,
  },
  {
    x: 2,
    y: -2,
  },
  {
    x: 2,
    y: 0,
  },
  {
    x: 2,
    y: 2,
  },
  {
    x: 0,
    y: 2,
  },
  {
    x: -2,
    y: 2,
  },
  {
    x: -2,
    y: 0,
  },
  {
    x: -2,
    y: -2,
  },
  {
    x: 0,
    y: -4,
  },
  {
    x: 2,
    y: -4,
  },
  {
    x: 4,
    y: -4,
  },
  {
    x: 4,
    y: -2,
  },
  {
    x: 4,
    y: 0,
  },
  {
    x: 4,
    y: 2,
  },
  {
    x: 4,
    y: 4,
  },
  {
    x: 2,
    y: 4,
  },
  {
    x: 0,
    y: 4,
  },
  {
    x: -2,
    y: 4,
  },
  {
    x: -4,
    y: 4,
  },
  {
    x: -4,
    y: 2,
  },
  {
    x: -4,
    y: 0,
  },
  {
    x: -4,
    y: -2,
  },
  {
    x: -4,
    y: -4,
  },
  {
    x: -2,
    y: -4,
  },
  {
    x: 6,
    y: -4,
  },
  {
    x: 6,
    y: -2,
  },
  {
    x: 6,
    y: 0,
  },
  {
    x: 6,
    y: 2,
  },
  {
    x: 6,
    y: 4,
  },
  {
    x: 6,
    y: 6,
  },
  {
    x: 4,
    y: 6,
  },
  {
    x: 2,
    y: 6,
  },
  {
    x: 0,
    y: 6,
  },
  {
    x: -2,
    y: 6,
  },
  {
    x: -4,
    y: 6,
  },
  {
    x: -6,
    y: 6,
  },
  {
    x: -6,
    y: 4,
  },
  {
    x: -6,
    y: 2,
  },
  {
    x: -6,
    y: 0,
  },
  {
    x: -6,
    y: -2,
  },
  {
    x: -6,
    y: -4,
  },
  {
    x: -6,
    y: -6,
  },
  {
    x: -4,
    y: -6,
  },
  {
    x: -2,
    y: -6,
  },
  {
    x: 0,
    y: -6,
  },
  {
    x: 2,
    y: -6,
  },
  {
    x: 4,
    y: -6,
  },
  {
    x: 5,
    y: 5,
  },
  {
    x: 3,
    y: 5,
  },
  {
    x: 1,
    y: 5,
  },
];
