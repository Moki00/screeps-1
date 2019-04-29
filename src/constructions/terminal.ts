export default function updateTerminal(room: Room): void {
    createTerminalConstructionSite(room);
}

export function createTerminalConstructionSite(room: Room): void {
    if (!room.storage) {
        // TODO: get rid of storage position dependency
        return;
    }

    const terminalPosition: RoomPosition = new RoomPosition(
        room.storage.pos.x,
        room.storage.pos.y + 2,
        room.name,
    );

    room.createConstructionSite(terminalPosition, STRUCTURE_TERMINAL);
}
