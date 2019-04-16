import Logger from '../../utils/logger';
import {getCreepPathStyle} from '../../visuals/config';
import recycle from '../common/recycle';
import withdrawAllResources from '../common/withdraw-all-resources';
import LooterState from './looter-state';
import {LOOT_FLAG_NAME} from './run-looter-role';

export function loot(creep: Creep): void {
    const lootFlag: Flag | undefined = Game.flags[LOOT_FLAG_NAME];
    if (!lootFlag) {
        Logger.warning('No loot flag, no loot target.');
        recycle(creep);
        return;
    }

    if (!isCreepInLootRoom(creep, lootFlag)) {
        creep.moveTo(lootFlag.pos, {
            reusePath: 50,
            visualizePathStyle: getCreepPathStyle(creep),
        });
        return;
    }

    if (!lootFlag.room) {
        return;
    }

    const lootTarget: StructureStorage | undefined = lootFlag.room.storage;

    if (!lootTarget) {
        Logger.info(`There are no more loot targets in ${lootFlag.room.name} room. Removing "${lootFlag.name}" flag.`);
        lootFlag.remove();
        return;
    }

    const withdrawCode: ScreepsReturnCode = withdrawAllResources(creep, lootTarget);
    switch (withdrawCode) {
        case ERR_NOT_IN_RANGE:
            creep.moveTo(lootTarget, {
                reusePath: 15,
                visualizePathStyle: getCreepPathStyle(creep),
            });
            break;
        case ERR_FULL:
            creep.memory.state = LooterState.SECURE_LOOT;
            break;
    }
}

function isCreepInLootRoom(creep: Creep, lootFlag: Flag): boolean {
    return creep.pos.roomName === lootFlag.pos.roomName;
}
