import { StructuresChunkLayout } from "./structures-layout.interface";
import { isPositionBuildable } from "./is-area-buildable";

export default function getPercentageOfLayoutBeingBuildable(
  topLeftPosition: RoomPosition,
  layout: StructuresChunkLayout
): number {
  const layoutBuildableStructures = layout.itemsInOrder.filter(
    (roomBlueprintItem) => roomBlueprintItem.structure !== undefined
  );

  const buidableStructures = layoutBuildableStructures.filter(
    (roomBlueprintItem) => {
      const roomPosition = Game.rooms[topLeftPosition.roomName].getPositionAt(
        topLeftPosition.x + roomBlueprintItem.position.x,
        topLeftPosition.y + roomBlueprintItem.position.y
      );
      return (
        roomPosition &&
        isPositionBuildable(
          Game.rooms[roomPosition.roomName],
          roomPosition.x,
          roomPosition.y
        )
      );
    }
  );

  return buidableStructures.length / layoutBuildableStructures.length;
}
