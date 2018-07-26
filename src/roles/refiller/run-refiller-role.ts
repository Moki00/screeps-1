import build from './build';
import findEnergy from './find-energy';
import harvest from './harvest';
import refillEnergy from './refill';
import refillUpgrader from './refill-upgrader';
import RefillerRoleState from './refiller-role-state';

export default function runRefillerRole(creep: Creep): void {
    switch (creep.memory.state) {
        case RefillerRoleState.REFILL:
            refillEnergy(creep);
            break;
        case RefillerRoleState.REFILL_UPGRADER:
            refillUpgrader(creep);
            break;
        case RefillerRoleState.FIND_ENERGY:
            findEnergy(creep);
            break;
        case RefillerRoleState.HARVEST:
            harvest(creep);
            break;
        case RefillerRoleState.BUILD:
            build(creep);
            break;
        default:
            findEnergy(creep);
    }
}
