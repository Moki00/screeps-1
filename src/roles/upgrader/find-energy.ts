import {getCreepPathStyle} from '../../visuals/config';
import UpgraderRoleState from './upgrader-role-state';

export default function findEnergy(creep: Creep): void {
    if (creep.room.energyAvailable >= creep.carryCapacity) {
        const spawn: StructureSpawn = creep.room.find(FIND_MY_SPAWNS)[0];
        creep.withdraw(spawn, RESOURCE_ENERGY, creep.carryCapacity);
    }

    if (creep.room.storage) {
        const withdrawReturnCode: ScreepsReturnCode =
            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
        switch (withdrawReturnCode) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(creep.room.storage, {
                    visualizePathStyle: getCreepPathStyle(creep),
                });
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                creep.memory.state = UpgraderRoleState.HARVEST;
                break;
        }
    } else if (creep.carry.energy === 0) {
        creep.memory.state = UpgraderRoleState.HARVEST;
    }

    if (creep.carry.energy > 0) {
        creep.memory.state = UpgraderRoleState.UPGRADE;
    }
}
