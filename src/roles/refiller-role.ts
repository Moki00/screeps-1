import {getUpgraderContainer, getUpgradingPosition} from '../constructions/upgrade-base';
import {refillerPathStyle} from '../visuals';

enum RefillerRoleState {
    REFILL,
    REFILL_UPGRADER,
    FIND_ENERGY,
    HARVEST,
    BUILD,
}

export default function runRefillerRole(creep: Creep): void {
    switch (creep.memory.state) {
        case RefillerRoleState.REFILL:
            refillEnergy(creep);
            break;
        case RefillerRoleState.REFILL_UPGRADER:
            refillUpgrader(creep);
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
    const refillTarget: StructureSpawn | StructureExtension | StructureTower | null =
        getRoomEnergyRefillTarget(creep);
    if (refillTarget) {
        const energyToFull: number = refillTarget.energyCapacity - refillTarget.energy;
        const transferReturnCode: ScreepsReturnCode =
            creep.transfer(refillTarget, RESOURCE_ENERGY, Math.min(creep.carry.energy, energyToFull));
        switch (transferReturnCode) {
            case OK:
                creep.say('😌🔝');
                break;
            case ERR_NOT_IN_RANGE:
                creep.say('🙂👉🔝');
                creep.moveTo(refillTarget, {
                    visualizePathStyle: refillerPathStyle,
                });
                break;
        }
    } else {
        creep.memory.state = RefillerRoleState.REFILL_UPGRADER;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = RefillerRoleState.FIND_ENERGY;
    }
}

function refillUpgrader(creep: Creep): void {
    const upgradingPosition: RoomPosition | null = getUpgradingPosition(creep.room);

    if (!upgradingPosition) {
        creep.memory.state = RefillerRoleState.BUILD;
        return;
    }

    const container: StructureContainer | null = getUpgraderContainer(creep.room);

    if (!container) {
        creep.memory.state = RefillerRoleState.BUILD;
        return;
    }

    const energyToFull: number = container.storeCapacity - container.store.energy;
    const transferReturnCode: ScreepsReturnCode =
        creep.transfer(container, RESOURCE_ENERGY, Math.min(creep.carry.energy, energyToFull));
    switch (transferReturnCode) {
        case OK:
            creep.say('😌🔝');
            break;
        case ERR_NOT_IN_RANGE:
            creep.say('😌👉🔝');
            creep.moveTo(container, {
                visualizePathStyle: refillerPathStyle,
            });
            break;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = RefillerRoleState.FIND_ENERGY;
    }
}

function getRoomEnergyRefillTarget(creep: Creep): StructureSpawn | StructureExtension | StructureTower | null {
    const spawns: StructureSpawn[] = creep.room
        .find(FIND_MY_SPAWNS)
        .filter((spawn) => spawn.energy < spawn.energyCapacity)
        .sort((a, b) => b.energy - a.energy);

    if (spawns.length) {
        return spawns[0];
    }

    const structures: AnyStructure[] = creep.room
        .find(FIND_STRUCTURES);

    const extensions: StructureExtension[] = structures
        .filter((structure) => {
            return (
                structure.structureType === STRUCTURE_EXTENSION &&
                structure.energy < structure.energyCapacity
            );
        }) as StructureExtension[];

    if (extensions.length) {
        return extensions[0];
    }

    const towers: StructureTower[] = structures
        .filter((structure) => {
            return (
                structure.structureType === STRUCTURE_TOWER &&
                structure.energy < structure.energyCapacity
            );
        }) as StructureTower[];

    if (towers.length) {
        return towers[0];
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
                creep.moveTo(mostFilledContainer, {
                    visualizePathStyle: refillerPathStyle,
                });
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
        creep.moveTo(source, {
            visualizePathStyle: refillerPathStyle,
        });
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
                creep.moveTo(constructionSites[0], {
                    visualizePathStyle: refillerPathStyle,
                });
                break;
        }
    } else {
        creep.say('💤');
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = RefillerRoleState.FIND_ENERGY;
    } else {
        creep.memory.state = RefillerRoleState.REFILL;
    }
}
