enum RefillerRoleState {
    REFILL,
    FIND_ENERGY,
    HARVEST,
    BUILD,
}

export default function runRefillerRole(creep: Creep): void {
    switch (creep.memory.state) {
        case RefillerRoleState.REFILL:
            refillEnergy(creep);
            break;
        case RefillerRoleState.FIND_ENERGY:
            findEnergy(creep);
            break;
        case RefillerRoleState.HARVEST:
            harvest(creep);
            break;
        case RefillerRoleState.BUILD:
            build(creep);
            break;
        default:
            findEnergy(creep);
    }
}

function refillEnergy(creep: Creep): void {
    if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
        const refillTarget: StructureSpawn | StructureExtension | null = getRoomEnergyRefillTarget(creep);
        if (refillTarget) {
            const energyToFull: number = refillTarget.energyCapacity - refillTarget.energy;
            const transferReturnCode: ScreepsReturnCode =
                creep.transfer(refillTarget, RESOURCE_ENERGY, Math.min(creep.carry.energy, energyToFull));
            switch (transferReturnCode) {
                case OK:
                    creep.say('😌🔝');
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.say('😌👉🔝');
                    creep.moveTo(refillTarget);
                    break;
            }
        } else {
            creep.memory.state = RefillerRoleState.BUILD;
        }
    } else {
        creep.memory.state = RefillerRoleState.BUILD;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = RefillerRoleState.FIND_ENERGY;
    }
}

function getRoomEnergyRefillTarget(creep: Creep): StructureSpawn | StructureExtension | null {
    const spawns: StructureSpawn[] = creep.room
        .find(FIND_MY_SPAWNS)
        .filter((spawn) => spawn.energy < spawn.energyCapacity)
        .sort((a, b) => b.energy - a.energy);

    if (spawns.length) {
        return spawns[0];
    }

    const extensions: StructureExtension[] = creep.room
        .find<StructureExtension>(FIND_STRUCTURES)
        .filter((structure) => {
            return (
                structure.structureType === STRUCTURE_EXTENSION &&
                structure.energy < structure.energyCapacity
            );
        });

    if (extensions.length) {
        return extensions[0];
    }

    return null;
}

function findEnergy(creep: Creep): void {
    creep.say('🙂🔎⚡');
    const containers: StructureContainer[] = creep.room
        .find<StructureContainer>(FIND_STRUCTURES)
        .filter((structure) => structure.structureType === STRUCTURE_CONTAINER)
        .sort((a, b) => b.store.energy - a.store.energy);

    if (containers.length) {
        const mostFilledContainer: StructureContainer = containers[0];

        const withdrawReturnCode: ScreepsReturnCode =
            creep.withdraw(mostFilledContainer, RESOURCE_ENERGY);
        switch (withdrawReturnCode) {
            case ERR_NOT_IN_RANGE:
                creep.say('🙂👉🔎⚡');
                creep.moveTo(mostFilledContainer);
                break;
        }
    } else {
        creep.memory.state = RefillerRoleState.HARVEST;
    }

    if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.state = RefillerRoleState.REFILL;
    }
}

function harvest(creep: Creep): void {
    const source: Source = creep.room.find(FIND_SOURCES)[0];
    creep.say(`😞⛏`);
    const harvestReturnCode: ScreepsReturnCode = creep.harvest(source);

    if (harvestReturnCode === ERR_NOT_IN_RANGE) {
        creep.say(`😞👉⛏`);
        creep.moveTo(source);
    }

    if (creep.carry.energy >= creep.carryCapacity) {
        creep.memory.state = RefillerRoleState.REFILL;
    }
}

function build(creep: Creep): void {
    const constructionSites: ConstructionSite[] = creep.room.find(FIND_CONSTRUCTION_SITES);

    if (constructionSites.length) {
        const buildReturnCode: ScreepsReturnCode = creep.build(constructionSites[0]);

        switch (buildReturnCode) {
            case OK:
                creep.say('😒⚒');
                break;
            case ERR_NOT_IN_RANGE:
                creep.say('😒👉⚒');
                creep.moveTo(constructionSites[0]);
                break;
        }
    } else {
        creep.say('💤');
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = RefillerRoleState.FIND_ENERGY;
    }
}
