import Size from "./size";

export default function getTopLeftPositionByAreaCenter(
  areaCenterPosition: RoomPosition,
  areaSize: Size
): RoomPosition | undefined {
  const topLeftPositionX =
    areaCenterPosition.x - Math.floor(areaSize.width / 2);
  const topLeftPositionY =
    areaCenterPosition.y - Math.floor(areaSize.height / 2);

  const isOutOfBoundaries = topLeftPositionX < 0 && topLeftPositionY < 0;
  if (isOutOfBoundaries) {
    return undefined;
  }

  const topLeftPosition: RoomPosition = new RoomPosition(
    topLeftPositionX,
    topLeftPositionY,
    areaCenterPosition.roomName
  );

  return topLeftPosition;
}
