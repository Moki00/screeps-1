import giveEnergy from './give-energy';
import HarvestTransporterState from './harvest-transporter-state';
import takeEnergy from './take-energy';

export default function runHarvestTransporterRole(creep: Creep): void {
    switch (creep.memory.state) {
        case HarvestTransporterState.TAKE_ENERGY:
            takeEnergy(creep);
            break;
        case HarvestTransporterState.GIVE_ENERGY:
            giveEnergy(creep);
            break;
        default:
            giveEnergy(creep);
    }
}
