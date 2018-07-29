export default function updateSafeZones(): void {
    Object.values(Game.rooms)
        .forEach((room) => {
            if (!room.controller) {
                return;
            }

            if (!isEnemyPresentInRoom(room)) {
                return;
            }

            if (shouldMyStructureBeSaved(room) || shouldControllerBeSaved) {
                room.controller.activateSafeMode();
            }
        });
}

function isEnemyPresentInRoom(room: Room): boolean {
    return !!room.find(FIND_HOSTILE_CREEPS).length;
}

function shouldMyStructureBeSaved(room: Room): boolean {
    return !!room.find(FIND_MY_STRUCTURES)
        .filter(isStructureCritical)
        .find((structure) => structure.hits < structure.hitsMax * 0.75);
}

function shouldControllerBeSaved(controller: StructureController): boolean {
    return controller.ticksToDowngrade < CONTROLLER_DOWNGRADE[controller.level] * 0.1;
}

function isStructureCritical(structure: Structure): boolean {
    const notCriticalStructures: StructureConstant[] =
        [STRUCTURE_RAMPART, STRUCTURE_WALL, STRUCTURE_ROAD, STRUCTURE_CONTAINER];
    return !notCriticalStructures.includes(structure.structureType);
}
