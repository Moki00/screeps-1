import { StructuresChunkLayout } from "../helpers/structures-layout.interface";

const extensionsChunkLayout: StructuresChunkLayout = {
  itemsInOrder: [
    {
      position: { x: 1, y: 0 },
      structure: STRUCTURE_EXTENSION,
    },
    {
      position: { x: 0, y: 1 },
      structure: STRUCTURE_EXTENSION,
    },
    {
      position: { x: 1, y: 1 },
      structure: STRUCTURE_EXTENSION,
    },
    {
      position: { x: 2, y: 1 },
      structure: STRUCTURE_EXTENSION,
    },
    {
      position: { x: 1, y: 2 },
      structure: STRUCTURE_EXTENSION,
    },
  ],
  size: {
    width: 3,
    height: 3,
  },
};

export default extensionsChunkLayout;
