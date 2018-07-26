import {getHarvestContainer} from '../../constructions/harvest-base';
import {getCreepPathStyle} from '../../visuals/config';
import HarvestTransporterState from './harvest-transporter-state';

export default function takeEnergy(creep: Creep): void {
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
                visualizePathStyle: getCreepPathStyle(creep),
            });
            break;
        }
    }
}
