import AnyStorableStructure from '../../utils/any-storable-structure.type';
import Logger from '../../utils/logger';
import {getCreepPathStyle} from '../../visuals/config';
import transferAllResources from '../common/transfer-all-resources';
import TransporterState from './transporter-state';

export default function transportTo(creep: Creep): void {
    const transportTarget: AnyStorableStructure | null = getTransporterTargetObject(creep);
    if (!transportTarget) {
        Logger.warning(`No transport (to) target for transporter '${creep.name}'.`);
        return;
    }

    const transferReturnCode: ScreepsReturnCode = transferAllResources(creep, transportTarget);
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

function getTransporterTargetObject(creep: Creep): AnyStorableStructure | null {
    if (!creep.memory.transportToObjectId) {
        return null;
    }

    return Game.getObjectById(creep.memory.transportToObjectId);
}
