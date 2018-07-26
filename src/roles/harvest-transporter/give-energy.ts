import {getCreepPathStyle} from '../../visuals/config';
import HarvestTransporterState from './harvest-transporter-state';

export default function giveEnergy(creep: Creep): void {
    transportEnergyToStorage(creep);
}

function transportEnergyToStorage(creep: Creep): void {
    if (!creep.room.storage) {
        console.log('Warning: No room storage to deliver');
        return;
    }

    const transferReturnCode: ScreepsReturnCode = creep.transfer(creep.room.storage, RESOURCE_ENERGY);
    switch (transferReturnCode) {
        case ERR_NOT_IN_RANGE:
            creep.moveTo(creep.room.storage, {
                visualizePathStyle: getCreepPathStyle(creep),
            });
            break;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = HarvestTransporterState.TAKE_ENERGY;
    }
}
