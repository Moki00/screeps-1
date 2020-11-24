export interface ImportantPositionData {
  roomPosition: RoomPosition;
  importanceMultiplier: number;
}

export default function sortRoomPositionsByClosestToOtherPositions(
  otherPositions: ImportantPositionData[]
): (a: RoomPosition, b: RoomPosition) => number {
  return function (
    roomPositionA: RoomPosition,
    roomPositionB: RoomPosition
  ): number {
    const rangeValueA: number = otherPositions.reduce<number>(
      (acc, { importanceMultiplier, roomPosition }) =>
        acc + roomPositionA.getRangeTo(roomPosition) * importanceMultiplier,
      0
    );
    const rangeValueB: number = otherPositions.reduce<number>(
      (acc, { importanceMultiplier, roomPosition }) =>
        acc + roomPositionB.getRangeTo(roomPosition) * importanceMultiplier,
      0
    );

    return rangeValueA - rangeValueB;
  };
}
