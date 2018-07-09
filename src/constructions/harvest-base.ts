import SourceMemory from './source-memory.interface';

export default function updateHarvestBases(room: Room) {
    initRoomSpawnsMemory(room);

    createHarvestingSpots(room);

    checkIfHarvestersExist(room);
}

export function getAnyFreeSourceId(room: Room): string | null {
    if (!room.memory.sources) {
        return null;
    }

    const anyFreeSourceMemory: SourceMemory | undefined = Object.values<SourceMemory>(room.memory.sources)
        .find((sourceMemory) => !sourceMemory.occupiedByCreepId);

    if (anyFreeSourceMemory) {
        return anyFreeSourceMemory.sourceId;
    }

    return null;
}

export function getHarvestingPosition(room: Room, sourceId: string): RoomPosition | null {
    if (!room.memory.sources[sourceId]) {
        console.log(`Warning: No such source id "${sourceId}" in room ${room.name}.`);
        return null;
    }

    if (!room.memory.sources[sourceId].harvestingPosition) {
        return null;
    }

    const { x, y } = room.memory.sources[sourceId].harvestingPosition as {x: number, y: number};
    return new RoomPosition(x, y, room.name);
}

export function getSourceOfHarvester(creep: Creep): Source | null {
    return Game.getObjectById(creep.memory.targetSourceId);
}

function getHarvesterBySourceId(sourceId: string): Creep | undefined {
    const source: Source | null = Game.getObjectById(sourceId);
    const room: Room | undefined = source ? source.room : undefined;
    if (!room) {
        return undefined;
    }

    return room.find(FIND_MY_CREEPS)
        .filter((creep) => creep.memory.role === 'harvester')
        .find((creep) => creep.memory.targetSourceId === sourceId);
}

function checkIfHarvestersExist(room: Room): void {
    Object.values<SourceMemory>(room.memory.sources)
        .forEach((sourceMemory) => {
            const creep: Creep | undefined = getHarvesterBySourceId(sourceMemory.sourceId);
            if (creep) {
                sourceMemory.occupiedByCreepId = creep.id;
            } else {
                sourceMemory.occupiedByCreepId = null;
            }
        });
}

function initRoomSpawnsMemory(room: Room): void {
    const sources: Source[] = room.find(FIND_SOURCES);

    room.memory.sources = {};

    sources.forEach((source) => {
        room.memory.sources[source.id] = {
            sourceId: source.id,
            occupiedByCreepId: null,
            harvestingPosition: null,
            towerPosition: null,
        };
    });
}

function createHarvestingSpots(room: Room): void {
    const spawns: StructureSpawn[] = room.find(FIND_MY_SPAWNS);
    const sources: Source[] = room.find(FIND_SOURCES);

    if (spawns && sources) {
        const spawn: StructureSpawn = spawns[0];
        sources.forEach((source) => {
            const pathSteps: PathStep[] = room
                .findPath(source.pos, spawn.pos, {
                    ignoreCreeps: true,
                    ignoreDestructibleStructures: true,
                    ignoreRoads: true,
                });

            room.createConstructionSite(pathSteps[0].x, pathSteps[0].y, STRUCTURE_CONTAINER);
            room.memory.sources[source.id].harvestingPosition = {
                x: pathSteps[0].x,
                y: pathSteps[0].y,
            };
        });
    }
}

function createGuardTowers(room: Room): void {
    // TODO: build harvester guard towers
}
