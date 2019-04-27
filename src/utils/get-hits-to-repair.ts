export default function getHitsToRepair(room: Room): number {
    return room.find(FIND_STRUCTURES)
        .filter((structure) => {
            if (structure.hits === undefined) {
                return false;
            }

            return !IGNORED_CONSTRUCTION_TYPES
                .find((structureType) => structureType === structure.structureType);
        })
        .map((structure) => {
            return structure.hitsMax - structure.hits;
        })
        .reduce((hitsAccomulator, hitsToRepair) => hitsAccomulator + hitsToRepair, 0);
}

const IGNORED_CONSTRUCTION_TYPES: string[] = [STRUCTURE_RAMPART, STRUCTURE_WALL];
