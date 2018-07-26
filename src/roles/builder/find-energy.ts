import {getCreepPathStyle} from '../../visuals/config';
import getMostFilledHarvesterContainer from '../common/get-most-filled-harvester-container';
import BuilderRoleState from './builder-role-state';

export default function findEnergy(creep: Creep): void {
    const mostFilledContainer: StructureContainer | undefined = getMostFilledHarvesterContainer(creep);

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

function goForEnergy(creep: Creep, target: StructureContainer | StructureStorage): void {
    const withdrawReturnCode: ScreepsReturnCode =
        creep.withdraw(target, RESOURCE_ENERGY, creep.carryCapacity);
    switch (withdrawReturnCode) {
        case ERR_NOT_IN_RANGE:
            creep.moveTo(target, {
                visualizePathStyle: getCreepPathStyle(creep),
            });
            break;
    }
}
