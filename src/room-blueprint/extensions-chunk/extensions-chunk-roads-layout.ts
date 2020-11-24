import { StructuresChunkLayout } from "../helpers/structures-layout.interface";
import extensionsChunkLayout from "./extensions-chunk-layout";

const extensionsChunkRoadsLayout: StructuresChunkLayout = {
  itemsInOrder: [
    {
      position: { x: 1, y: -1 },
      structure: STRUCTURE_ROAD,
    },
    {
      position: { x: 2, y: 0 },
      structure: STRUCTURE_ROAD,
    },
    {
      position: { x: 3, y: 1 },
      structure: STRUCTURE_ROAD,
    },
    {
      position: { x: 2, y: 2 },
      structure: STRUCTURE_ROAD,
    },
    {
      position: { x: 1, y: 3 },
      structure: STRUCTURE_ROAD,
    },
    {
      position: { x: 0, y: 2 },
      structure: STRUCTURE_ROAD,
    },
    {
      position: { x: -1, y: 1 },
      structure: STRUCTURE_ROAD,
    },
    {
      position: { x: 0, y: 0 },
      structure: STRUCTURE_ROAD,
    },
  ],
  size: {
    width: extensionsChunkLayout.size.width,
    height: extensionsChunkLayout.size.height,
  },
};

export default extensionsChunkRoadsLayout;
