import {getUpgradingPosition} from '../constructions/upgrade-base';
import {upgraderPathStyle} from '../visuals/creep-paths';

enum UpgraderRoleState {
    UPGRADE,
    FIND_ENERGY,
    HARVEST,
}

function runUpgradeController(creep: Creep) {
    switch (creep.memory.state) {
        case UpgraderRoleState.UPGRADE:
            upgrade(creep);
            break;
        case UpgraderRoleState.FIND_ENERGY:
            findSomeEnergy(creep);
            break;
        case UpgraderRoleState.HARVEST:
            harvest(creep);
            break;
        default:
            findSomeEnergy(creep);
    }
}

function upgrade(creep: Creep): void {
    const controller: StructureController | undefined = creep.room.controller;

    const upgradingPosition: RoomPosition | null = getUpgradingPosition(creep.room);

    if (controller && upgradingPosition) {
        if (!isUpgraderOnPlace(creep.room)) {
            creep.moveTo(upgradingPosition, {
                visualizePathStyle: upgraderPathStyle,
            });
        } else {
            const container: StructureContainer | undefined = creep.pos.lookFor(LOOK_STRUCTURES)
                .find((structure) => structure.structureType === STRUCTURE_CONTAINER) as StructureContainer | undefined;
            if (container) {
                creep.withdraw(container, RESOURCE_ENERGY);
            }
        }

        const upgradeReturnCode: ScreepsReturnCode = creep.upgradeController(controller);
        switch (upgradeReturnCode) {
            case ERR_NOT_ENOUGH_ENERGY:
                creep.memory.state = UpgraderRoleState.FIND_ENERGY;
                break;
        }

    }
}

function isUpgraderOnPlace(room: Room): boolean {
    const upgrader: Creep | undefined = room
        .find(FIND_MY_CREEPS)
        .find((creep) => creep.memory.role === 'upgrader');

    if (!upgrader) {
        return false;
    }

    if (
        !upgrader.room.memory.controller ||
        !upgrader.room.memory.controller.upgradingPosition ||
        !upgrader.room.memory.controller.upgradingPosition.x ||
        !upgrader.room.memory.controller.upgradingPosition.y
    ) {
        return false;
    }

    return (
        upgrader.pos.x === upgrader.room.memory.controller.upgradingPosition.x &&
        upgrader.pos.y === upgrader.room.memory.controller.upgradingPosition.y
    );
}

function findSomeEnergy(creep: Creep): void {
    if (creep.room.energyAvailable >= creep.carryCapacity) {
        const spawn: StructureSpawn = creep.room.find(FIND_MY_SPAWNS)[0];
        creep.withdraw(spawn, RESOURCE_ENERGY, creep.carryCapacity);
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = UpgraderRoleState.HARVEST;
    }

    if (creep.carry.energy > 0) {
        creep.memory.state = UpgraderRoleState.UPGRADE;
    }
}

function harvest(creep: Creep): void {
    const source: Source = creep.room.find(FIND_SOURCES)[0];
    const harvestReturnCode: ScreepsReturnCode = creep.harvest(source);

    if (harvestReturnCode === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
            visualizePathStyle: upgraderPathStyle,
        });
    }

    if (creep.carry.energy >= creep.carryCapacity) {
        creep.memory.state = UpgraderRoleState.UPGRADE;
    }
}

export default runUpgradeController;
