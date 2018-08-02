import areTransportTargetsAssigned from './are-transport-targets-assigned';
import assignTransportTargets from './assign-transport-targets';
import transportFrom from './transport-from';
import transportTo from './transport-to';
import TransporterState from './transporter-state';

export default function runTransporterRole(creep: Creep): void {
    if (!areTransportTargetsAssigned(creep)) {
        assignTransportTargets(creep);
    }

    switch (creep.memory.state) {
        case TransporterState.TRANSPORT_FROM:
            transportFrom(creep);
            break;
        case TransporterState.TRANSPORT_TO:
            transportTo(creep);
            break;
        default:
            transportFrom(creep);
    }
}
