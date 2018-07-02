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
            const containerPosition: RoomPosition | null = getSourceContainerPos(source);
            if (containerPosition) {
                creep.moveTo(containerPosition);
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
        position.createConstructionSite(STRUCTURE_CONTAINER);
    }

    const constructionSites: ConstructionSite[] = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, creep.pos);
    if (constructionSites.length) {
        creep.say('🙂⛏⚡🔨🗑');
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

function getSourceContainerPos(source: Source): RoomPosition | null {
    if (!source.room.memory.sources) {
        return null;
    }

    if (!source.room.memory.sources[source.id]) {
        return null;
    }

    const containerId: string = source.room.memory.sources[source.id].containerId;

    const container: _HasRoomPosition | null = Game.getObjectById(containerId);

    if (!container) {
        return null;
    }

    return container.pos;
}

function getEnergySource(room: Room): Source {
    return room.find(FIND_SOURCES)[0];
}
