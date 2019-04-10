import {getCreepPathStyle} from '../../visuals/config';
import withdrawAllResources from '../common/withdraw-all-resources';
import getDroppedResource from './get-dropped-energy';
import getTombstone from './get-tombstone';
import HooverRoleState from './hoover-role-state';

export default function pickUpResources(creep: Creep): void {
    const droppedResource: Resource | undefined = getDroppedResource(creep);
    if (droppedResource) {
        pickUpDroppedEnergy(creep, droppedResource);
        return;
    }

    const tombstone: Tombstone | undefined = getTombstone(creep);
    if (tombstone) {
        const withdrawReturnCode: ScreepsReturnCode = withdrawAllResources(creep, tombstone);
        switch (withdrawReturnCode) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(tombstone, {
                    visualizePathStyle: getCreepPathStyle(creep),
                });
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                break;
            case ERR_FULL:
                creep.memory.state = HooverRoleState.STORE;
                break;
        }
        return;
    }

    creep.memory.state = HooverRoleState.STORE;
}

function pickUpDroppedEnergy(creep: Creep, droppedResource: Resource): void {
    const pickupReturnCode: ScreepsReturnCode = creep.pickup(droppedResource);
    switch (pickupReturnCode) {
        case ERR_NOT_IN_RANGE:
            creep.moveTo(droppedResource, {
                visualizePathStyle: getCreepPathStyle(creep),
            });
            break;
        case ERR_FULL:
            creep.memory.state = HooverRoleState.STORE;
            break;
    }
}
