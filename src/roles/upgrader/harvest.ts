import {getUpgraderContainer} from '../../constructions/upgrade-base';
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

    const upgradeContainer: StructureContainer | undefined = getUpgraderContainer(creep.room);

    const hasUpgradeContainerEnoughEnergy: boolean =
        !!upgradeContainer && (upgradeContainer.store.energy > (upgradeContainer.storeCapacity * 0.1));

    if ((creep.carry.energy >= creep.carryCapacity) || hasUpgradeContainerEnoughEnergy) {
        creep.memory.state = UpgraderRoleState.UPGRADE;
    }
}
