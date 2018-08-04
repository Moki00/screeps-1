import {getCreepPathStyle} from '../../visuals/config';
import DefenderRoleState from './defender-role-state';

export default function attack(creep: Creep): void {
    const target: Creep | undefined = creep.room.find(FIND_HOSTILE_CREEPS).find(() => true);

    if (!target) {
        creep.memory.state = DefenderRoleState.SAFE;
        return;
    }

    creep.moveTo(target, {
        visualizePathStyle: getCreepPathStyle(creep),
    });
    creep.attack(target);
}
