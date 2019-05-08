import Logger from '../utils/logger';
import simplyfyRoomPosition from '../utils/simplify-room-position';
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
    if (room.storage) {
        createAntiDowngradeRampartsAround(room.controller);
    }

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

export function getUpgraderContainer(room: Room): StructureContainer | undefined {
    const upgradingPosition: RoomPosition | null = getUpgradingPosition(room);

    if (!upgradingPosition) {
        return;
    }

    const container: StructureContainer | undefined = upgradingPosition.lookFor(LOOK_STRUCTURES)
        .find((structure) => structure.structureType === STRUCTURE_CONTAINER) as StructureContainer | undefined;

    if (!container) {
        return;
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

    const upgraderContainer: StructureContainer | undefined = getUpgraderContainer(controller.room);
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
    const upgradingPosition: RoomPosition | undefined = findUpgradingPosition(room);

    if (!upgradingPosition) {
        Logger.error(`Could not find upgrading position in ${room}.`);
        return;
    }

    room.createConstructionSite(upgradingPosition, STRUCTURE_CONTAINER);
    room.memory.controller.upgradingPosition = simplyfyRoomPosition(upgradingPosition);
}

function findUpgradingPosition(room: Room): RoomPosition | undefined {
    const spawn: StructureSpawn | undefined = room.find(FIND_MY_SPAWNS).find(() => true);
    const controller: StructureController | undefined = room.controller;

    if (!spawn || !controller) {
        return;
    }

    const pathSteps: PathStep[] = room
        .findPath(controller.pos, spawn.pos, {
            ignoreCreeps: true,
            ignoreDestructibleStructures: true,
            ignoreRoads: true,
        });

    return new RoomPosition(
        pathSteps[0].x,
        pathSteps[0].y,
        room.name,
    );
}

function createAntiDowngradeRampartsAround(controller: StructureController): void {
    for (let offsetX = -1; offsetX <= 1; offsetX++) {
        for (let offsetY = -1; offsetY <= 1; offsetY++) {
            if (offsetX === 0 && offsetY === 0) {
                continue;
            }

            controller.room.createConstructionSite(
                controller.pos.x + offsetX,
                controller.pos.y + offsetY,
                STRUCTURE_RAMPART,
            );
        }
    }
}

function initControllerMemory(room: Room): void {
    room.memory.controller = {
        upgradingPosition: null,
        previousProgress: (room.memory.controller && room.memory.controller.previousProgress)
            ? room.memory.controller.previousProgress : 0,
        transporterCreepId: null,
    };
}
