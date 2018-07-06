export default function runHarvesterRole(creep: Creep): void {
    const source: Source = getEnergySource(creep.room);

    const harvestReturnCode: ScreepsReturnCode = creep.harvest(source);
    switch (harvestReturnCode) {
        case OK: {
            creep.say(`😌⛏⚡`);
            buildContainer(creep, source);
            break;
        }
        case ERR_NOT_IN_RANGE: {
            creep.say(`🙂👉⛏⚡`);
            const container: StructureContainer | null =
                getSourceContainerOrConstructionSite<StructureContainer>(source);
            if (container) {
                creep.moveTo(container);
            } else {
                creep.moveTo(source);
            }
            break;
        }
    }
}

function buildContainer(creep: Creep, source: Source) {
    if (!source.room.memory.sources) {
        initRoomSpawnsMemory(source.room);
    }

    if (!doesSourceHasContainer(source)) {
        const position: RoomPosition = creep.pos;
        const createConstructionSiteReturnCode: ScreepsReturnCode =
            position.createConstructionSite(STRUCTURE_CONTAINER);
        if (createConstructionSiteReturnCode === OK) {
            const constructionSite: ConstructionSite = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, position)[0];
            source.room.memory.sources[source.id] = {
                containerId: constructionSite.id,
            };
        }
    } else {
        const container: StructureContainer | null =
            Game.getObjectById<StructureContainer>(creep.room.memory.sources[source.id].containerId);
        if (container) {
            creep.repair(container);
        }
    }

    const constructionSites: ConstructionSite[] = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, creep.pos);
    if (constructionSites.length && creep.carry.energy >= 5) {
        creep.say('🙂🔨🗑');
        creep.build(constructionSites[0]);
    }
}

function doesSourceHasContainer(source: Source): boolean {
    return (
        source.room.memory.sources &&
        source.room.memory.sources[source.id] &&
        !!source.room.memory.sources[source.id].containerId
    );
}

function initRoomSpawnsMemory(room: Room): void {
    const sources: Source[] = room.find(FIND_SOURCES);

    room.memory.sources = {};

    sources.forEach((source) => {
        room.memory.sources[source.id] = {
            containerId: null,
        };
    });
}

function getSourceContainerOrConstructionSite<StructureType>(source: Source): StructureType | null {
    if (!source.room.memory.sources) {
        return null;
    }

    if (!source.room.memory.sources[source.id]) {
        return null;
    }

    const containerOrConstructionSiteId: string = source.room.memory.sources[source.id].containerId;

    return Game.getObjectById<StructureType>(containerOrConstructionSiteId);
}

function getEnergySource(room: Room): Source {
    return room.find(FIND_SOURCES)[0];
}
