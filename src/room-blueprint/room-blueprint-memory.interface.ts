import SimpleRoomPosition from "../constructions/simple-room-position.interface";

export interface RoomBlueprintItem {
  structure: StructureConstant | undefined;
  position: SimpleRoomPosition;
  rcl?: number;
}

export default interface RoomBlueprint {
  createdAt: number;
  itemsInBuildOrder: RoomBlueprintItem[];
}
