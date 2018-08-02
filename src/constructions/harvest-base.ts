import SourceMemory from './source-memory.interface';

export default function updateHarvestBases(room: Room) {
    if (!room.memory.sources) {
        initRoomSpawnsMemory(room);
    }

    createHarvestingSpots(room);

    checkIfHarvestersExist(room);
    checkIfTransportersExist(room);
}

export function getAnySourceIdWithoutHarvester(room: Room): string | undefined {
    if (!room.memory.sources) {
        return undefined;
    }

    const sourceMemoryWithoutHarvester: SourceMemory | undefined = Object.values<SourceMemory>(room.memory.sources)
        .find((sourceMemory) => !sourceMemory.harvesterCreepId);

    if (sourceMemoryWithoutHarvester) {
        return sourceMemoryWithoutHarvester.sourceId;
    }

    return undefined;
}

export function getAnySourceIdWithoutTransporter(room: Room): string | null {
    if (!room.memory.sources) {
        return null;
    }

    const sourceMemoryWithoutTransporter: SourceMemory | undefined = Object.values<SourceMemory>(room.memory.sources)
        .find((sourceMemory) => !sourceMemory.transporterCreepId);

    if (sourceMemoryWithoutTransporter) {
        return sourceMemoryWithoutTransporter.sourceId;
    }

    return null;
}

export function getHarvestingPositionBySourceId(sourceId: string): RoomPosition | null {
    const source: Source | null = Game.getObjectById(sourceId);

    if (!source) {
        return null;
    }

    if (!source.room.memory.sources[sourceId]) {
        console.log(`Warning: No such source id "${sourceId}" in room ${source.room.name}.`);
        return null;
    }

    if (!source.room.memory.sources[sourceId].harvestingPosition) {
        return null;
    }

    const { x, y } = source.room.memory.sources[sourceId].harvestingPosition as {x: number, y: number};
    return new RoomPosition(x, y, source.room.name);
}

export function getSourceOfHarvester(creep: Creep): Source | null {
    return Game.getObjectById(creep.memory.targetSourceId);
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
    const source: Source | null = Game.getObjectById(sourceId);
    const room: Room | undefined = source ? source.room : undefined;
    if (!room) {
        return undefined;
    }

    return room.find(FIND_MY_CREEPS)
        .filter((creep) => creep.memory.role === 'harvester')
        .find((creep) => creep.memory.targetSourceId === sourceId);
}

function getTransporterBySourceId(sourceId: string): Creep | undefined {
    const source: Source | null = Game.getObjectById(sourceId);
    if (!source) {
        return undefined;
    }

    const container: StructureContainer | null = getHarvestContainerBySourceId(sourceId);
    if (!container) {
        return undefined;
    }

    return source.room.find(FIND_MY_CREEPS)
        .filter((creep) => creep.memory.role === 'transporter')
        .find((creep) => creep.memory.transportFromObjectId === container.id);
}

function checkIfHarvestersExist(room: Room): void {
    Object.values<SourceMemory>(room.memory.sources)
        .forEach((sourceMemory) => {
            const creep: Creep | undefined = getHarvesterBySourceId(sourceMemory.sourceId);
            if (creep) {
                sourceMemory.harvesterCreepId = creep.id;
            } else {
                sourceMemory.harvesterCreepId = null;
            }
        });
}

function checkIfTransportersExist(room: Room): void {
    Object.values<SourceMemory>(room.memory.sources)
        .forEach((sourceMemory) => {
            const creep: Creep | undefined = getTransporterBySourceId(sourceMemory.sourceId);
            if (creep) {
                sourceMemory.transporterCreepId = creep.id;
            } else {
                sourceMemory.transporterCreepId = null;
            }
        });
}

function initRoomSpawnsMemory(room: Room): void {
    const sources: Source[] = room.find(FIND_SOURCES);

    room.memory.sources = {};

    sources.forEach((source) => {
        room.memory.sources[source.id] = {
            sourceId: source.id,
            harvesterCreepId: null,
            transporterCreepId: null,
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
