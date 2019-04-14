import {getRoomEarlyStorageContainer} from '../../constructions/storage';
import {getUpgraderContainer} from '../../constructions/upgrade-base';
import {getCreepPathStyle} from '../../visuals/config';
import BuilderRoleState from './builder-role-state';

export default function repair(creep: Creep): void {
    repairUpgradeContainer(creep);
}

function repairUpgradeContainer(creep: Creep): void {
    const earlyStorageContainer: StructureContainer | undefined = getRoomEarlyStorageContainer(creep.room);
    const container: StructureContainer | null =
        earlyStorageContainer && (earlyStorageContainer.hits < earlyStorageContainer.hitsMax)
            ? earlyStorageContainer
            : getUpgraderContainer(creep.room);

    if (!container) {
        creep.memory.state = BuilderRoleState.BUILD;
        return;
    }

    const repairReturnCode: ScreepsReturnCode = creep.repair(container);
    switch (repairReturnCode) {
        case ERR_NOT_IN_RANGE:
            creep.moveTo(container, {
                visualizePathStyle: getCreepPathStyle(creep),
            });
            break;
    }

    if (creep.room.find(FIND_CONSTRUCTION_SITES)) {
        creep.memory.state = BuilderRoleState.BUILD;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = BuilderRoleState.FIND_ENERGY;
    }
}
