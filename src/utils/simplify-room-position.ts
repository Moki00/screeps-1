import SimpleRoomPosition from "../constructions/simple-room-position.interface";

export default function simplyfyRoomPosition(
  roomPosition: RoomPosition
): SimpleRoomPosition {
  return {
    x: roomPosition.x,
    y: roomPosition.y,
    room: roomPosition.roomName,
  };
}
