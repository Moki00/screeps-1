import {getUpgradingPosition} from '../../constructions/upgrade-base';
import {getCreepPathStyle} from '../../visuals/config';
import UpgraderRoleState from './upgrader-role-state';

export default function upgrade(creep: Creep): void {
    const controller: StructureController | undefined = creep.room.controller;

    const upgradingPosition: RoomPosition | null = getUpgradingPosition(creep.room);

    if (!controller || !upgradingPosition) {
        return;
    }

    const isCreepOnUpgradingContainer: boolean = creep.pos.isEqualTo(upgradingPosition);

    if (!isCreepOnUpgradingContainer) {
        creep.moveTo(upgradingPosition, {
            visualizePathStyle: getCreepPathStyle(creep),
        });
    }

    const container: StructureContainer | undefined = getUpgradingContainer(creep.room);
    if (container && creep.pos.isNearTo(container.pos)) {
        creep.withdraw(container, RESOURCE_ENERGY);
    }

    const upgradeReturnCode: ScreepsReturnCode = creep.upgradeController(controller);
    switch (upgradeReturnCode) {
        case ERR_NOT_ENOUGH_ENERGY:
            if (!container || container.store.energy === 0) {
                creep.memory.state = UpgraderRoleState.FIND_ENERGY;
            }
            break;
    }
}

function getUpgradingContainer(room: Room): StructureContainer | undefined {
    const position: RoomPosition | null = getUpgradingPosition(room);

    if (!position) {
        return undefined;
    }

    return position.lookFor(LOOK_STRUCTURES)
        .find((structure) => structure.structureType === STRUCTURE_CONTAINER) as StructureContainer | undefined;
}
