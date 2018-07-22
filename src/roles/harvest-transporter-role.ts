import {getHarvestContainer} from '../constructions/harvest-base';
import {harvestTransporterPathStyle} from '../visuals/creep-paths';

enum HarvestTransporterState {
    TAKE_ENERGY,
    GIVE_ENERGY,
}

export default function runHarvestTransporterRole(creep: Creep): void {
    switch (creep.memory.state) {
        case HarvestTransporterState.TAKE_ENERGY:
            getEnergy(creep);
            break;
        case HarvestTransporterState.GIVE_ENERGY:
            transportEnergyToStorage(creep);
            break;
        default:
            transportEnergyToStorage(creep);
    }
}

function getEnergy(creep: Creep): void {
    const container: StructureContainer | undefined = getHarvestContainer(creep);

    if (!container) {
        return;
    }

    const withdrawReturnCode: ScreepsReturnCode = creep.withdraw(container, RESOURCE_ENERGY);
    switch (withdrawReturnCode) {
        case OK:
            creep.memory.state = HarvestTransporterState.GIVE_ENERGY;
            break;
        case ERR_NOT_IN_RANGE: {
            creep.moveTo(container, {
                visualizePathStyle: harvestTransporterPathStyle,
            });
            break;
        }
    }
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
                visualizePathStyle: harvestTransporterPathStyle,
            });
            break;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = HarvestTransporterState.TAKE_ENERGY;
    }
}

function saveDroppedEnergy(creep: Creep) {
    const energyResource: Resource | undefined = creep.pos.lookFor(LOOK_RESOURCES)
        .find((resource) => resource.resourceType === RESOURCE_ENERGY) as Resource | undefined;
    if (!energyResource) {
        return;
    }

    creep.pickup(energyResource);
}
