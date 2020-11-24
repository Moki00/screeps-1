export function getRooms(): Room[] {
  return Object.values(Game.rooms);
}

export function isRoomWithBlueprint(room: Room): boolean {
  return !!room.memory.roomBlueprint;
}

export function isRoomWithNoBlueprint(room: Room): boolean {
  return !isRoomWithBlueprint(room);
}

export function getRoomsWithNoBlueprint(): Room[] {
  return getRooms().filter(isRoomWithNoBlueprint);
}

export function getAnyRoomWithNoBlueprint(): Room | undefined {
  return getRoomsWithNoBlueprint().find(() => true);
}

export function getRoomsWithBlueprint(): Room[] {
  return getRooms().filter(isRoomWithBlueprint);
}
