import build from './build';
import BuilderRoleState from './builder-role-state';
import findEnergy from './find-energy';
import repair from './repair';

export default function runBuilderRole(creep: Creep): void {
    switch (creep.memory.state) {
        case BuilderRoleState.BUILD:
            build(creep);
            break;
        case BuilderRoleState.FIND_ENERGY:
            findEnergy(creep);
            break;
        case BuilderRoleState.REPAIR:
            repair(creep);
            break;
        default:
            build(creep);
    }
}
