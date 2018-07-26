import {getCreepPathStyle} from '../../visuals/config';
import UpgraderRoleState from './upgrader-role-state';

export default function harvest(creep: Creep): void {
    const source: Source = creep.room.find(FIND_SOURCES)[0];
    const harvestReturnCode: ScreepsReturnCode = creep.harvest(source);

    if (harvestReturnCode === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
            visualizePathStyle: getCreepPathStyle(creep),
        });
    }

    if (creep.carry.energy >= creep.carryCapacity) {
        creep.memory.state = UpgraderRoleState.UPGRADE;
    }
}
