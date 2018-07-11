export default function updateUpgradeBase(room: Room) {
    initControllerMemory(room);

    createUpgradingSpot(room);
}

export function getUpgradingPosition(room: Room): RoomPosition | null {
    if (
        !room.memory.controller ||
        !room.memory.controller.upgradingPosition ||
        !room.memory.controller.upgradingPosition.x ||
        !room.memory.controller.upgradingPosition.y
    ) {
        return null;
    }

    return new RoomPosition(
        room.memory.controller.upgradingPosition.x,
        room.memory.controller.upgradingPosition.y,
        room.name,
    );
}

export function getUpgraderContainer(room: Room): StructureContainer | null {
    const upgradingPosition: RoomPosition | null = getUpgradingPosition(room);

    if (!upgradingPosition) {
        return null;
    }

    const container: StructureContainer | undefined = upgradingPosition.lookFor(LOOK_STRUCTURES)
        .find((structure) => structure.structureType === STRUCTURE_CONTAINER) as StructureContainer | undefined;

    if (!container) {
        return null;
    }

    return container;
}

function createUpgradingSpot(room: Room): void {
    const spawns: StructureSpawn[] = room.find(FIND_MY_SPAWNS);
    const controller: StructureController | undefined = room.controller;

    if (spawns && controller) {
        const spawn: StructureSpawn = spawns[0];
        const pathSteps: PathStep[] = room
            .findPath(controller.pos, spawn.pos, {
                ignoreCreeps: true,
                ignoreDestructibleStructures: true,
                ignoreRoads: true,
            });

        room.createConstructionSite(pathSteps[0].x, pathSteps[0].y, STRUCTURE_CONTAINER);
        room.memory.controller.upgradingPosition = {
            x: pathSteps[0].x,
            y: pathSteps[0].y,
        };
    }
}

function initControllerMemory(room: Room): void {
    room.memory.controller = {
        upgradingPosition: null,
        towerPosition: null,
    };
}
