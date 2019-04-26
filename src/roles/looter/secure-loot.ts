import Logger from '../../utils/logger';
import {getCreepPathStyle} from '../../visuals/config';
import recycle from '../common/recycle';
import LooterState from './looter-state';

export function secureLoot(creep: Creep): void {
    const homeRoom: Room = Game.rooms[creep.memory.originRoom];
    const transferTarget: StructureStorage | undefined = homeRoom.storage;
    if (!transferTarget) {
        Logger.warning('No storage to secure loot!');
        return;
    }

    const transferCode: ScreepsReturnCode = creep.transfer(transferTarget, RESOURCE_ENERGY);
    switch (transferCode) {
        case ERR_NOT_ENOUGH_ENERGY:
            creep.memory.state = LooterState.LOOT;
            if (creep.ticksToLive && creep.ticksToLive < TICKS_TO_TRAVEL_BOTH_WAYS) {
                recycle(creep);
            }
            break;
        case ERR_NOT_IN_RANGE:
            creep.moveTo(transferTarget, {
                reusePath: 50,
                visualizePathStyle: getCreepPathStyle(creep),
            });
            break;
    }
}

const TICKS_TO_TRAVEL_BOTH_WAYS: number = 400; // TODO: estimate it
