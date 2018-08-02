import {getCreepPathStyle} from '../../visuals/config';
import TransporterState from './transporter-state';

export default function transportFrom(creep: Creep): void {
    const transportTarget: StructureContainer | StructureStorage | null = getTransporterTargetObject(creep);
    if (!transportTarget) {
        console.log(`Warning: No transport target for transporter '${creep.name}'.`);
        return;
    }

    const withdrawReturnCode: ScreepsReturnCode = creep.withdraw(transportTarget, RESOURCE_ENERGY);
    switch (withdrawReturnCode) {
        case OK:
            creep.memory.state = TransporterState.TRANSPORT_TO;
            break;
        case ERR_NOT_IN_RANGE: {
            creep.moveTo(transportTarget, {
                visualizePathStyle: getCreepPathStyle(creep),
            });
            break;
        }
    }
}

function getTransporterTargetObject(creep: Creep): StructureContainer | StructureStorage | null {
    if (!creep.memory.transportFromObjectId) {
        return null;
    }

    return Game.getObjectById<StructureContainer | StructureStorage>(creep.memory.transportFromObjectId);
}
