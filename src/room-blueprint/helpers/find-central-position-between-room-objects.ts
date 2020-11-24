export default function findCentralPositionBetweenRoomObjects(
  roomObjects: RoomObject[]
): RoomPosition | undefined {
  const roomName = roomObjects[0].room?.name;
  if (roomObjects.length < 2 || !roomName) {
    return undefined;
  }

  const coordinatesSum = roomObjects.reduce(
    (acc, roomObject) => {
      return {
        x: acc.x + roomObject.pos.x,
        y: acc.y + roomObject.pos.y,
      };
    },
    { x: 0, y: 0 }
  );
  return new RoomPosition(
    coordinatesSum.x / roomObjects.length,
    coordinatesSum.y / roomObjects.length,
    roomName
  );
}
