import Logger from '../../utils/logger';
import {getCreepPathStyle} from '../../visuals/config';
import recycle from '../common/recycle';
import {getRoomsToScout} from './rooms-to-scout';

export default function runScoutRole(creep: Creep): void {
    const originRoom: Room = Game.rooms[creep.memory.originRoom];

    if (!creep.memory.scoutRoomTarget) {
        creep.memory.scoutRoomTarget = getRoomsToScout(originRoom).find(() => true);
    }

    const targetRoomName: string | undefined = creep.memory.scoutRoomTarget;
    if (!targetRoomName) {
        recycle(creep);
        return;
    }

    moveToRoom(creep, targetRoomName);

    if (creep.room.name === targetRoomName) {
        reportRoom(creep);
    }
}

function reportRoom(creep: Creep): void {
    reportRoomSources(creep.room.name);

    creep.room.memory.lastScoutUpdateTick = Game.time;
    creep.memory.scoutRoomTarget = undefined;
}

function reportRoomSources(roomName: string): void {
    const room: Room | undefined = Game.rooms[roomName];
    if (!room) {
        Logger.error(`Can't report "${roomName}" room.`);
        return;
    }

    const sources: Source[] = room.find(FIND_SOURCES);

    sources.forEach((source) => {
        room.memory.sources[source.id] = {
            sourceId: source.id,
            harvesterCreepId: null,
            transporterCreepId: null,
            harvestingPosition: null,
        };
    });
}

function moveToRoom(creep: Creep, targetRoomName: string): void {
    const exitDirection: ExitConstant | ERR_NO_PATH | ERR_INVALID_ARGS = Game.map.findExit(creep.room, targetRoomName);

    if (exitDirection === ERR_NO_PATH || exitDirection === ERR_INVALID_ARGS) {
        Logger.error(`${creep} couldn't find exit to "${targetRoomName}" room`);
        return;
    }

    const exit: RoomPosition | null = creep.pos.findClosestByRange(exitDirection);

    if (!exit) {
        Logger.error(`${creep} couldn't find exit to "${targetRoomName}" room`);
        return;
    }

    creep.moveTo(exit, {
        reusePath: 50,
        visualizePathStyle: getCreepPathStyle(creep),
    });
}
