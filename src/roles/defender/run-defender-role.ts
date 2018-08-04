import attack from './attack';
import DefenderRoleState from './defender-role-state';
import recycle from './recycle';

export default function runDefenderRole(creep: Creep): void {
    switch (creep.memory.state) {
        case DefenderRoleState.DANGER:
            attack(creep);
            break;
        case DefenderRoleState.SAFE:
            recycle(creep);
            break;
        default:
            attack(creep);
    }
}
