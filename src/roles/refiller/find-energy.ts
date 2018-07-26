import {getCreepPathStyle} from '../../visuals/config';
import getMostFilledHarvesterContainer from '../common/get-most-filled-harvester-container';
import RefillerRoleState from './refiller-role-state';

export default function findEnergy(creep: Creep): void {
    const mostFilledContainer: StructureContainer | undefined = getMostFilledHarvesterContainer(creep);

    if (creep.room.storage || mostFilledContainer) {
        const target: StructureContainer | StructureStorage | undefined
            = creep.room.storage ? creep.room.storage : mostFilledContainer;

        if (target) {
            goForEnergy(creep, target);
        }
    } else {
        creep.memory.state = RefillerRoleState.HARVEST;
    }

    if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.state = RefillerRoleState.REFILL;
    }
}

function goForEnergy(creep: Creep, target: StructureContainer | StructureStorage): void {
    const withdrawReturnCode: ScreepsReturnCode =
        creep.withdraw(target, RESOURCE_ENERGY);
    switch (withdrawReturnCode) {
        case ERR_NOT_IN_RANGE:
            creep.moveTo(target, {
                visualizePathStyle: getCreepPathStyle(creep),
            });
            break;
        case ERR_NOT_ENOUGH_RESOURCES:
            creep.memory.state = RefillerRoleState.HARVEST;
            break;
    }
}
