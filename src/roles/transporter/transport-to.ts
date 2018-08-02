import {getCreepPathStyle} from '../../visuals/config';
import TransporterState from './transporter-state';

export default function transportTo(creep: Creep): void {
    const transportTarget: StructureContainer | StructureStorage | null = getTransporterTargetObject(creep);
    if (!transportTarget) {
        console.log(`Warning: No transport target for transporter '${creep.name}'.`);
        return;
    }

    const transferReturnCode: ScreepsReturnCode = creep.transfer(transportTarget, RESOURCE_ENERGY);
    switch (transferReturnCode) {
        case OK:
            creep.memory.state = TransporterState.TRANSPORT_FROM;
            break;
        case ERR_NOT_IN_RANGE:
            creep.moveTo(transportTarget, {
                visualizePathStyle: getCreepPathStyle(creep),
            });
            creep.memory.state = TransporterState.TRANSPORT_TO;
            break;
        case ERR_NOT_ENOUGH_RESOURCES:
            creep.memory.state = TransporterState.TRANSPORT_FROM;
            break;
    }
}

function getTransporterTargetObject(creep: Creep): StructureContainer | StructureStorage | null {
    if (!creep.memory.transportToObjectId) {
        return null;
    }

    return Game.getObjectById<StructureContainer | StructureStorage>(creep.memory.transportToObjectId);
}
