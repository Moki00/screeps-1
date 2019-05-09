import {first} from 'lodash';

export default function createStoragesConstructionSites(room: Room): void {
    const spawn: StructureSpawn | undefined = first(room.find(FIND_MY_SPAWNS));

    if (!spawn) {
        return;
    }

    createStorageConstructionSite(spawn);
    createEarlyStorageContainerConstructionSite(spawn);
}

function createStorageConstructionSite(spawn: StructureSpawn): void {
    const isStorageAvailable: boolean = CONTROLLER_STRUCTURES[STRUCTURE_STORAGE][spawn.room.controller!.level] > 0;
    if (!isStorageAvailable) {
        return;
    }

    const roomPosition: RoomPosition = new RoomPosition(
        spawn.pos.x,
        spawn.pos.y + 1,
        spawn.room.name,
    );
    spawn.room.createConstructionSite(roomPosition, STRUCTURE_STORAGE);
    spawn.room.createConstructionSite(roomPosition, STRUCTURE_RAMPART);
}

function createEarlyStorageContainerConstructionSite(spawn: StructureSpawn): void {
    spawn.room.createConstructionSite(
        getEarlyStorageContainerPosition(spawn),
        STRUCTURE_CONTAINER,
    );
}

export function getEarlyStorageContainerPosition(spawn: StructureSpawn): RoomPosition {
    return new RoomPosition(spawn.pos.x, spawn.pos.y - 1, spawn.room.name);
}

export function getRoomEarlyStorageContainer(room: Room): StructureContainer | undefined {
    const spawn: StructureSpawn | undefined = first(room.find(FIND_MY_SPAWNS));

    if (!spawn) {
        return;
    }

    const container: StructureContainer | undefined = room
        .lookForAt<LOOK_STRUCTURES>(LOOK_STRUCTURES, getEarlyStorageContainerPosition(spawn))
        .find((structure) => structure.structureType === STRUCTURE_CONTAINER) as StructureContainer | undefined;

    if (!container) {
        return;
    }

    return container;
}

export function isThereAnyStorageInRoom(room: Room): boolean {
    const earlyStorage: StructureContainer | undefined = getRoomEarlyStorageContainer(room);
    const storage: StructureStorage | undefined = room.storage;

    return !!earlyStorage && !!storage;
}
