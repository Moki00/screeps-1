import { StructuresChunkLayout } from "./structures-layout.interface";
import { RoomBlueprintItem } from "../room-blueprint-memory.interface";
import addRoomBlueprintItemByStructure from "../add-room-blueprint-item";
import { isPositionBuildable } from "./is-area-buildable";

interface Options {
  filterNotBuildable: boolean;
}

export interface RoomBlueprintAddedStats {
  [structureConstant: string]: number;
}

export default function addRoomBlueprintItemsByLayout(
  topLeftPosition: RoomPosition,
  layout: StructuresChunkLayout,
  { filterNotBuildable }: Options = { filterNotBuildable: false }
): RoomBlueprintAddedStats {
  const numberOfAddedStructures: RoomBlueprintAddedStats = {};

  const roomBlueprintItemsWithTranslatedPositions: RoomBlueprintItem[] = layout.itemsInOrder
    .map<RoomBlueprintItem>(({ position: { x, y }, rcl, structure }) => {
      return {
        structure,
        position: { x: topLeftPosition.x + x, y: topLeftPosition.y + y },
        rcl,
      };
    })
    .filter((roomBlueprintItem) => {
      if (!filterNotBuildable) {
        return true;
      }

      return isPositionBuildable(
        Game.rooms[topLeftPosition.roomName],
        roomBlueprintItem.position.x,
        roomBlueprintItem.position.y
      );
    });

  roomBlueprintItemsWithTranslatedPositions.forEach((roomBlueprintItem) => {
    const position: RoomPosition | null = Game.rooms[
      topLeftPosition.roomName
    ].getPositionAt(roomBlueprintItem.position.x, roomBlueprintItem.position.y);

    if (!position) {
      return;
    }

    addRoomBlueprintItemByStructure(position, roomBlueprintItem.structure);
    if (roomBlueprintItem.structure !== undefined) {
      numberOfAddedStructures[
        roomBlueprintItem.structure
      ] = numberOfAddedStructures[roomBlueprintItem.structure]
        ? (numberOfAddedStructures[roomBlueprintItem.structure] += 1)
        : 1;
    }
  });

  return numberOfAddedStructures;
}
