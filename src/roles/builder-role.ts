import {first} from 'lodash';
import {getUpgraderContainer} from '../constructions/upgrade-base';
import {builderPathStyle} from '../visuals/creep-paths';

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
            case ERR_NOT_IN_RANGE:
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
    const mostFilledContainer: StructureContainer | undefined = first(
        creep.room
            .find<StructureContainer>(FIND_STRUCTURES)
            .filter((structure) => structure.structureType === STRUCTURE_CONTAINER)
            .sort((a, b) => b.store.energy - a.store.energy)
            .sort((a, b) => {
                const distanceA: number = a.pos.findPathTo(creep, {ignoreCreeps: true}).length;
                const distanceB: number = b.pos.findPathTo(creep, {ignoreCreeps: true}).length;
                return distanceA - distanceB;
            }),
    );

    if (creep.room.storage || mostFilledContainer) {
        const target: StructureStorage | StructureContainer | undefined =
            creep.room.storage ? creep.room.storage : mostFilledContainer;

        if (target) {
            goForEnergy(creep, target);
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
        case ERR_NOT_IN_RANGE:
            creep.moveTo(container, {
                visualizePathStyle: builderPathStyle,
            });
            break;
    }

    if (creep.room.find(FIND_CONSTRUCTION_SITES)) {
        creep.memory.state = BuilderRoleState.BUILD;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = BuilderRoleState.FIND_ENERGY;
    }
}

function goForEnergy(creep: Creep, target: StructureContainer | StructureStorage): void {
    const withdrawReturnCode: ScreepsReturnCode =
        creep.withdraw(target, RESOURCE_ENERGY, creep.carryCapacity);
    switch (withdrawReturnCode) {
        case ERR_NOT_IN_RANGE:
            creep.moveTo(target, {
                visualizePathStyle: builderPathStyle,
            });
            break;
    }
}
