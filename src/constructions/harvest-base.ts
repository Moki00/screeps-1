import getExitRoomsNames from '../utils/get-exit-rooms-names';
import Logger from '../utils/logger';
import simplyfyRoomPosition from '../utils/simplify-room-position';
import drawHarvestBaseInfo from '../visuals/draw-harvest-base-info';
import {isRoomMine} from './rooms';
import SourceMemory from './source-memory.interface';

export default function updateHarvestBases(originRoom: Room) {
    const remoteRooms: string[] = findRemoteHarvestableRoomsNames(originRoom);
    [originRoom.name, ...remoteRooms].forEach((roomName) => {
        const room: Room | undefined = Game.rooms[roomName];

        if (room) {
            if (!room.memory.sources) {
                initRoomSourcesMemory(room, originRoom);
            }

            createHarvestingConstructionSites(room, originRoom);
        }

        checkIfContainerExists(roomName);
        checkIfHarvestersExist(roomName);
        checkIfTransportersExist(roomName);

        drawHarvestBaseInfo(roomName);
    });
}

export function getHarvesterSourceMemory(sourceId: string, originRoomName: string): SourceMemory | undefined {
    const roomNames: string[] = [originRoomName, ...getRemoteRoomsNames(originRoomName)];
    return getSourceMemoriesByRoomNames(roomNames)
        .find((sourceMemory) => sourceMemory.sourceId === sourceId);
}

export function getSourceMemoriesByRoomNames(roomNames: string[]): SourceMemory[] {
    return roomNames
        .filter((roomName) => !!Memory.rooms[roomName] && !!Memory.rooms[roomName].sources)
        .reduce<SourceMemory[]>((acc, roomName) => {
            const thisRoomSourceIdsWithoutHarvesters: SourceMemory[] =
                Object.values<SourceMemory>(Memory.rooms[roomName].sources);

            return [...acc, ...thisRoomSourceIdsWithoutHarvesters];
        }, []);
}

export function getAllSourceMemories(): SourceMemory[] {
    const allMemoryRooms: string[] = Object.keys(Memory.rooms);
    return getSourceMemoriesByRoomNames(allMemoryRooms);
}

export function getSourceMemoryBySourceId(sourceId: string): SourceMemory | undefined {
    return getAllSourceMemories()
        .find((sourceMemory) => sourceMemory.sourceId === sourceId);
}

export function getSourceMemoriesByOriginRoom(originRoomName: string): SourceMemory[] {
    const roomNames: string[] = [originRoomName, ...getRemoteRoomsNames(originRoomName)];
    return getSourceMemoriesByRoomNames(roomNames);
}

export function getSourceMemoriesWithLackingHarvester(roomNames: string[]): SourceMemory[] {
    return getSourceMemoriesByRoomNames(roomNames)
        .filter((sourceMemory) => !sourceMemory.harvesterCreepId);
}

export function getSourceMemoriesWithLackingHarvesterByOriginRoom(originRoomName: string): SourceMemory[] {
    const roomsWithSources: string[] = [originRoomName, ...getRemoteRoomsNames(originRoomName)];
    return getSourceMemoriesWithLackingHarvester(roomsWithSources);
}

export function getSourceMemoriesWithLackingTransporter(roomNames: string[]): SourceMemory[] {
    return getSourceMemoriesByRoomNames(roomNames)
        .filter((sourceMemory) => !sourceMemory.transporterCreepId);
}

export function getSourceMemoriesWithLackingTransporterByOriginRoom(originRoomName: string): SourceMemory[] {
    const roomsWithSources: string[] = [originRoomName, ...getRemoteRoomsNames(originRoomName)];
    return getSourceMemoriesWithLackingTransporter(roomsWithSources);
}

export function getHarvestingPositionBySourceId(sourceId: string): RoomPosition | null {
    const source: Source | null = Game.getObjectById(sourceId);

    if (!source) {
        return null;
    }

    if (!source.room.memory.sources[sourceId]) {
        Logger.warning(`No such source id "${sourceId}" in room ${source.room.name}.`);
        return null;
    }

    if (!source.room.memory.sources[sourceId].harvestingPosition) {
        return null;
    }

    const { x, y } = source.room.memory.sources[sourceId].harvestingPosition as {x: number, y: number};
    return new RoomPosition(x, y, source.room.name);
}

export function getHarvestContainerBySourceId(sourceId: string): StructureContainer | null {
    const source: Source | null = Game.getObjectById(sourceId);

    if (!source) {
        return null;
    }

    const harvestingPosition: RoomPosition | null = getHarvestingPositionBySourceId(source.id);

    if (!harvestingPosition) {
        return null;
    }

    const container: StructureContainer | undefined = harvestingPosition
        .lookFor(LOOK_STRUCTURES)
        .find((structure) => structure.structureType === STRUCTURE_CONTAINER) as StructureContainer | undefined;

    if (!container) {
        return null;
    }

    return container;
}

function getHarvesterBySourceId(sourceId: string): Creep | undefined {
    return Object.values(Game.creeps)
        .find((creep) => creep.memory.targetSourceId === sourceId);
}

function getTransporterBySourceId(sourceId: string): Creep | undefined {
    const sourceMemory: SourceMemory | undefined = getSourceMemoryBySourceId(sourceId);
    if (!sourceMemory) {
        Logger.error(`Can't find source memory by id "${sourceId}".`);
        return;
    }
    return Object.values(Game.creeps)
        .find((creep) => creep.memory.transportFromObjectId === sourceMemory.containerId);
}

function checkIfContainerExists(roomName: string): void {
    getSourceMemoriesByRoomNames([roomName])
        .forEach((sourceMemory) => {
            const harvestContainer: StructureContainer | null = getHarvestContainerBySourceId(sourceMemory.sourceId);
            Memory.rooms[roomName].sources[sourceMemory.sourceId].containerId =
                harvestContainer ? harvestContainer.id : null;
        });
}

function checkIfHarvestersExist(roomName: string): void {
    getSourceMemoriesByRoomNames([roomName])
        .forEach((sourceMemory) => {
            const creep: Creep | undefined = getHarvesterBySourceId(sourceMemory.sourceId);
            Memory.rooms[roomName].sources[sourceMemory.sourceId].harvesterCreepId = creep ? creep.id : null;
        });
}

function checkIfTransportersExist(roomName: string): void {
    getSourceMemoriesByRoomNames([roomName])
        .forEach((sourceMemory) => {
            const creep: Creep | undefined = getTransporterBySourceId(sourceMemory.sourceId);
            Memory.rooms[roomName].sources[sourceMemory.sourceId].transporterCreepId = creep ? creep.id : null;
        });
}

export function initRoomSourcesMemory(room: Room, originRoom: Room): void {
    const sources: Source[] = room.find(FIND_SOURCES);

    room.memory.sources = {};

    sources.forEach((source) => {
        const harvestingPosition: RoomPosition | undefined = findHarvestingPosition(source, originRoom);
        if (!harvestingPosition) {
            return;
        }

        room.memory.sources[source.id] = {
            sourceId: source.id,
            harvesterCreepId: null,
            containerId: null,
            transporterCreepId: null,
            harvestingPosition: simplyfyRoomPosition(harvestingPosition),
        };
    });
}

function findHarvestingPosition(source: Source, originRoom: Room): RoomPosition | undefined {
    const anySpawn: StructureSpawn | undefined = originRoom.find(FIND_MY_SPAWNS).find(() => true);
    if (!anySpawn) {
        Logger.error(`Can't find harvesting position. Can't find path from ${source} to ${originRoom}.`);
        return;
    }

    const pathSteps: PathStep[] = source.room
        .findPath(
            source.pos,
            anySpawn.pos,
            {
                ignoreCreeps: true,
                ignoreDestructibleStructures: true,
                ignoreRoads: true,
            },
        );

    if (!pathSteps.length) {
        Logger.error(`Can't find harvesting position. Can't find path from ${source} to ${originRoom}.`);
        return;
    }

    return new RoomPosition(
        pathSteps[0].x,
        pathSteps[0].y,
        source.room.name,
    );
}

function createHarvestingConstructionSites(room: Room, originRoom: Room): void {
    const spawn: StructureSpawn | undefined = originRoom.find(FIND_MY_SPAWNS).find(() => true);
    const sources: Source[] = room.find(FIND_SOURCES);

    if (!spawn || !sources) {
        return;
    }

    sources.forEach((source) => {
        const harvestingPosition: RoomPosition | undefined = findHarvestingPosition(source, originRoom);
        if (!harvestingPosition) {
            return;
        }

        room.createConstructionSite(harvestingPosition, STRUCTURE_CONTAINER);
        room.createConstructionSite(harvestingPosition, STRUCTURE_RAMPART);

        room.memory.sources[source.id].harvestingPosition = simplyfyRoomPosition(harvestingPosition);
    });
}

function findCloseRemoteRoomsNames(room: Room): string[] {
    return getExitRoomsNames(room.name)
        .filter((roomName) => Object.keys(Memory.rooms).includes(roomName));
}

function findRemoteHarvestableRoomsNames(room: Room): string[] {
    const remoteRooms: string[] = findCloseRemoteRoomsNames(room)
        .filter((roomName) => {
            const hasRoomOnlyOneSource: boolean = getRoomSourcesCount(roomName) === 1;
            return (
                hasRoomOnlyOneSource &&
                !isRoomMine(Game.rooms[roomName])
            );
        });

    Memory.rooms[room.name].remoteRooms = remoteRooms;

    return remoteRooms;
}

export function getRemoteRoomsNames(originRoom: string): string[] {
    return Memory.rooms[originRoom].remoteRooms;
}

function getRoomSourcesCount(roomName: string): number | undefined {
    if (!Memory.rooms[roomName].sources) {
        return;
    }

    return Object.keys(Memory.rooms[roomName].sources).length;
}
