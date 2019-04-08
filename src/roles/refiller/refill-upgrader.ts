import {getUpgraderContainer, getUpgradingPosition} from '../../constructions/upgrade-base';
import {getCreepPathStyle} from '../../visuals/config';
import RefillerRoleState from './refiller-role-state';

export default function refillUpgrader(creep: Creep): void {
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
        case ERR_NOT_IN_RANGE:
            creep.moveTo(container, {
                visualizePathStyle: getCreepPathStyle(creep),
            });
            break;
        case ERR_FULL:
            creep.memory.state = RefillerRoleState.REFILL;
            break;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = RefillerRoleState.FIND_ENERGY;
    }
}
