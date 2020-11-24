import Size from "./size";
import { RoomBlueprintItem } from "../room-blueprint-memory.interface";

export interface StructuresChunkLayout {
  itemsInOrder: RoomBlueprintItem[];
  size: Size;
}
