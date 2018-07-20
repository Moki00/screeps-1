export default function createTowersContructionSites(spawn: StructureSpawn): void {

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
    relativePositions.forEach((relativePosition) => {
        spawn.room.createConstructionSite(
            spawn.pos.x + relativePosition.x,
            spawn.pos.y + relativePosition.y,
            STRUCTURE_TOWER,
        );
    });
}
