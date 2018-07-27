import {getCreepPathStyle} from '../../visuals/config';
import getMostFilledHarvesterContainer from './get-most-filled-harvester-container';

export default function findEnergy(creep: Creep, findEnergyOptions: FindEnergyConfiguration): void {
    let withdrawTarget: StructureContainer | StructureStorage | undefined;
    if (creep.memory.withdrawTargetId) {
        withdrawTarget =
            Game.getObjectById(creep.memory.withdrawTargetId) as StructureContainer | StructureStorage | undefined;
    } else {
        withdrawTarget = findTarget(creep);
        if (withdrawTarget) {
            creep.memory.withdrawTargetId = withdrawTarget.id;
        }
    }

    if (!withdrawTarget) {
        return;
    }

    const withdrawReturnCode: ScreepsReturnCode =
        creep.withdraw(withdrawTarget, RESOURCE_ENERGY);
    switch (withdrawReturnCode) {
        case OK:
            creep.memory.state = findEnergyOptions.onWithdrawState;
            creep.memory.withdrawTargetId = undefined;
            break;
        case ERR_NOT_IN_RANGE:
            creep.moveTo(withdrawTarget, {
                visualizePathStyle: getCreepPathStyle(creep),
            });
            break;
        case ERR_NOT_ENOUGH_RESOURCES:
            creep.memory.state = findEnergyOptions.onNotEnoughResourcesState;
            break;
    }
}

function findTarget(creep: Creep): StructureContainer | StructureStorage | undefined {
    if (creep.memory.withdrawTargetId) {
        return Game.getObjectById(creep.memory.withdrawTargetId) as StructureContainer | StructureStorage | undefined;
    }

    if (creep.room.storage) {
        return creep.room.storage;
    }

    return getMostFilledHarvesterContainer(creep);
}

interface FindEnergyConfiguration {
    onWithdrawState: string;
    onNotEnoughResourcesState: string;
}
