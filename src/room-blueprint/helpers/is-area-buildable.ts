import Size from "./size";
import { ROOM_SIZE } from "../../utils/constants";
import getTopLeftPositionByAreaCenter from "./get-top-left-position-by-area-center";

function isRoomPositionReservedForAnotherStructure(
  room: Room,
  x: number,
  y: number
): boolean {
  return (
    !!room.memory.roomBlueprint &&
    room.memory.roomBlueprint.itemsInBuildOrder.some(
      (roomBlueprintItem) =>
        roomBlueprintItem.position.x === x && roomBlueprintItem.position.y === y
    )
  );
}

export function isPositionBuildable(room: Room, x: number, y: number): boolean {
  const isWall = room.getTerrain().get(x, y) === TERRAIN_MASK_WALL;
  const isReservedForAnotherStructure = isRoomPositionReservedForAnotherStructure(
    room,
    x,
    y
  );
  return !isWall && !isReservedForAnotherStructure;
}

export function isAreaBuildAbleByTopLeftPosition(
  topLeftPosition: RoomPosition,
  areaSize: Size
): boolean {
  const topLeftPositionX = topLeftPosition.x;
  const topLeftPositionY = topLeftPosition.y;
  const bottomRightPositionX = topLeftPosition.x + areaSize.width;
  const bottomRightPositionY = topLeftPosition.y + areaSize.height;

  const isAreaOutOfRoomBoundaries: boolean =
    topLeftPositionX < 0 ||
    topLeftPositionY < 0 ||
    bottomRightPositionX > ROOM_SIZE ||
    bottomRightPositionY > ROOM_SIZE;
  if (isAreaOutOfRoomBoundaries) {
    return false;
  }

  for (let i = 0; i < areaSize.height; i++) {
    for (let j = 0; j < areaSize.width; j++) {
      const x = topLeftPositionX + j;
      const y = topLeftPositionY + i;
      if (!isPositionBuildable(new Room(topLeftPosition.roomName), x, y))
        return false;
    }
  }

  return true;
}

export function isAreaBuildableByCenterPosition(
  centerPosition: RoomPosition,
  areaSize: Size
): boolean {
  const topLeftPosition = getTopLeftPositionByAreaCenter(
    centerPosition,
    areaSize
  );

  if (!topLeftPosition) {
    return false;
  }

  return isAreaBuildAbleByTopLeftPosition(topLeftPosition, areaSize);
}
