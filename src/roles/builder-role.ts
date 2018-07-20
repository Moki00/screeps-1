import {getUpgraderContainer} from '../constructions/upgrade-base';
import {builderPathStyle} from '../visuals';

enum BuilderRoleState {
    BUILD,
    REPAIR,
    FIND_ENERGY,
}

export default function runBuilderRole(creep: Creep): void {
    switch (creep.memory.state) {
        case BuilderRoleState.BUILD:
            build(creep);
            break;
        case BuilderRoleState.FIND_ENERGY:
            findEnergy(creep);
            break;
        case BuilderRoleState.REPAIR:
            repairUpgradeContainer(creep);
            break;
        default:
            build(creep);
    }
}

function build(creep: Creep): void {
    const constructionSites: ConstructionSite[] = creep.room.find(FIND_CONSTRUCTION_SITES);

    if (constructionSites.length) {
        const buildReturnCode: ScreepsReturnCode = creep.build(constructionSites[0]);

        switch (buildReturnCode) {
            case OK:
                creep.say('🙂🔨🗑');
                break;
            case ERR_NOT_IN_RANGE:
                creep.say('🙂👉🔨🗑');
                creep.moveTo(constructionSites[0], {
                    visualizePathStyle: builderPathStyle,
                });
                break;
        }
    } else {
        creep.memory.state = BuilderRoleState.REPAIR;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = BuilderRoleState.FIND_ENERGY;
    }
}

function findEnergy(creep: Creep): void {
    const containers: StructureContainer[] = creep.room
        .find<StructureContainer>(FIND_STRUCTURES)
        .filter((structure) => structure.structureType === STRUCTURE_CONTAINER)
        .sort((a, b) => b.store.energy - a.store.energy);

    if (containers.length) {
        const mostFilledContainer: StructureContainer = containers[0];

        const withdrawReturnCode: ScreepsReturnCode =
            creep.withdraw(mostFilledContainer, RESOURCE_ENERGY, creep.carryCapacity);
        switch (withdrawReturnCode) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(mostFilledContainer, {
                    visualizePathStyle: builderPathStyle,
                });
                break;
        }
    }

    if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.state = BuilderRoleState.BUILD;
    }
}

function repairUpgradeContainer(creep: Creep): void {
    const container: StructureContainer | null = getUpgraderContainer(creep.room);

    if (!container) {
        creep.memory.state = BuilderRoleState.BUILD;
        return;
    }

    const repairReturnCode: ScreepsReturnCode = creep.repair(container);
    switch (repairReturnCode) {
        case OK:
            creep.say('🙂🛠🗑');
            break;
        case ERR_NOT_IN_RANGE:
            creep.say('🙂👉🛠🗑');
            creep.moveTo(container, {
                visualizePathStyle: builderPathStyle,
            });
            break;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = BuilderRoleState.FIND_ENERGY;
    }
}
