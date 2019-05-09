import getExitRoomsNames from '../../utils/get-exit-rooms-names';

export function updateRoomsToScout(room: Room): void {
    room.memory.roomsToScout = findRoomsNamesToScout(room);
}

export function getRoomsToScout(room: Room): string[] {
    return room.memory.roomsToScout || [];
}

function findRoomsNamesToScout(room: Room): string[] {
    return Object.values(getExitRoomsNames(room.name))
        .filter((roomName) => doesRoomNeedToBeScouted(roomName!)) as string[];
}

function doesRoomNeedToBeScouted(roomName: string): boolean {
    const isRoomVisible: boolean = !!Game.rooms[roomName];
    const isRoomDataExpired: boolean = isScoutDataExpired(getLastScoutUpdateTick(roomName));

    return !isRoomVisible && isRoomDataExpired;
}

function getLastScoutUpdateTick(roomName: string): number {
    if (!Memory.rooms[roomName]) {
        return 0;
    }

    return Memory.rooms[roomName].lastScoutUpdateTick || 0;
}

function isScoutDataExpired(scoutUpdateTime: number): boolean {
    return Game.time - scoutUpdateTime > SCOUT_ROOM_EXPIRATION_TIME;
}

const SCOUT_ROOM_EXPIRATION_TIME: number = 2000;
