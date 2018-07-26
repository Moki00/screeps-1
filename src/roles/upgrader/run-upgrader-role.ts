import findEnergy from './find-energy';
import harvest from './harvest';
import upgrade from './upgrade';
import UpgraderRoleState from './upgrader-role-state';

function runUpgraderRole(creep: Creep) {
    switch (creep.memory.state) {
        case UpgraderRoleState.UPGRADE:
            upgrade(creep);
            break;
        case UpgraderRoleState.FIND_ENERGY:
            findEnergy(creep);
            break;
        case UpgraderRoleState.HARVEST:
            harvest(creep);
            break;
        default:
            findEnergy(creep);
    }
}

export default runUpgraderRole;
