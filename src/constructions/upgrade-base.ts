import Logger from '../utils/logger';
import drawRclStats from '../visuals/draw-rcl-stats';

export default function updateUpgradeBase(room: Room): void {
    if (!room.controller) {
        return;
    }

    if (!room.memory.controller) {
        initControllerMemory(room);
    }

    initControllerMemory(room);

    createUpgradingSpot(room);
    checkIfTransporterExist(room);

    drawRclStats(room);

    room.memory.controller.previousProgress = room.controller.progress;
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

export function getUpgradingSpeed(controller: StructureController): number {
    return controller.progress - controller.room.memory.controller.previousProgress;
}

export function doesUpgradeTransporterExist(room: Room): boolean {
    return !!room.memory.controller.transporterCreepId;
}

export function doesUpgradersContainerExist(room: Room): boolean {
    if (!room.memory.controller.upgradingPosition) {
        return false;
    }

    return !!room
        .lookForAt(
            LOOK_STRUCTURES,
            room.memory.controller.upgradingPosition.x,
            room.memory.controller.upgradingPosition.y,
        )
        .find((structure) => structure.structureType === STRUCTURE_CONTAINER);
}

export function getTransporterByControllerId(controllerId: string): Creep | undefined {
    const controller: StructureController | null = Game.getObjectById<StructureController>(controllerId);

    if (!controller) {
        Logger.warning('No such controller');
        return undefined;
    }

    const upgraderContainer: StructureContainer | null = getUpgraderContainer(controller.room);
    if (!upgraderContainer) {
        return undefined;
    }

    return controller.room.find(FIND_MY_CREEPS)
        .find((creep) => {
            return (
                creep.memory.role === 'transporter' &&
                creep.memory.transportToObjectId === upgraderContainer.id
            );
        });
}

function checkIfTransporterExist(room: Room): void {
    if (!room.controller) {
        return;
    }

    const creep: Creep | undefined = getTransporterByControllerId(room.controller.id);
    if (creep) {
        room.memory.controller.transporterCreepId = creep.id;
    } else {
        room.memory.controller.transporterCreepId = null;
    }
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
        previousProgress: (room.memory.controller && room.memory.controller.previousProgress)
            ? room.memory.controller.previousProgress : 0,
        transporterCreepId: null,
    };
}
