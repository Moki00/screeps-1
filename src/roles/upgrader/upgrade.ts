import {getUpgradingPosition} from '../../constructions/upgrade-base';
import {getCreepPathStyle} from '../../visuals/config';
import UpgraderRoleState from './upgrader-role-state';

export default function upgrade(creep: Creep): void {
    const controller: StructureController | undefined = creep.room.controller;

    const upgradingPosition: RoomPosition | null = getUpgradingPosition(creep.room);

    if (controller && upgradingPosition) {
        if (!isUpgraderOnPlace(creep.room)) {
            creep.moveTo(upgradingPosition, {
                visualizePathStyle: getCreepPathStyle(creep),
            });
        } else {
            const container: StructureContainer | undefined = creep.pos.lookFor(LOOK_STRUCTURES)
                .find((structure) => structure.structureType === STRUCTURE_CONTAINER) as StructureContainer | undefined;
            if (container) {
                creep.withdraw(container, RESOURCE_ENERGY);
            }
        }

        const upgradeReturnCode: ScreepsReturnCode = creep.upgradeController(controller);
        switch (upgradeReturnCode) {
            case ERR_NOT_ENOUGH_ENERGY:
                creep.memory.state = UpgraderRoleState.FIND_ENERGY;
                break;
        }

    }
}

function isUpgraderOnPlace(room: Room): boolean {
    const upgrader: Creep | undefined = room
        .find(FIND_MY_CREEPS)
        .find((creep) => creep.memory.role === 'upgrader');

    if (!upgrader) {
        return false;
    }

    if (
        !upgrader.room.memory.controller ||
        !upgrader.room.memory.controller.upgradingPosition ||
        !upgrader.room.memory.controller.upgradingPosition.x ||
        !upgrader.room.memory.controller.upgradingPosition.y
    ) {
        return false;
    }

    return (
        upgrader.pos.x === upgrader.room.memory.controller.upgradingPosition.x &&
        upgrader.pos.y === upgrader.room.memory.controller.upgradingPosition.y
    );
}
