import {getCreepPathStyle} from '../../visuals/config';
import transferAllResources from '../common/transfer-all-resources';
import getSumOfResourcesToClean from './get-sum-of-resourcer-to-clean';
import HooverRoleState from './hoover-role-state';

export default function storeResources(creep: Creep): void {
    const target: StructureStorage | undefined = creep.room.storage;

    if (!target) {
        console.log(`Warning: storage is the only target and it doesn't exists!`);
        return;
    }

    const transferReturnCode: ScreepsReturnCode = transferAllResources(creep, target);
    switch (transferReturnCode) {
        case OK:
            break;
        case ERR_NOT_IN_RANGE:
            creep.moveTo(target, {
                visualizePathStyle: getCreepPathStyle(creep),
            });
            break;
    }

    if (!isCreepCarryingAnything(creep) && getSumOfResourcesToClean(creep.room) === 0) {
        creep.suicide();
    }

    if (!isCreepCarryingAnything(creep)) {
        creep.memory.state = HooverRoleState.CLEAN;
    }
}

function isCreepCarryingAnything(creep: Creep): boolean {
    return !!Object.values(creep.carry).find((resourceAmount) => resourceAmount > 0);
}