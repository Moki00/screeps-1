export default function sortRoomPositionsByClosestToPoint(
  roomPosition: RoomPosition
): (a: RoomPosition, b: RoomPosition) => number {
  return function (
    roomPositionA: RoomPosition,
    roomPositionB: RoomPosition
  ): number {
    const rangeToPerfectPosA = roomPositionA.getRangeTo(roomPosition);
    const rangeToPerfectPosB = roomPositionB.getRangeTo(roomPosition);
    return rangeToPerfectPosA - rangeToPerfectPosB;
  };
}
