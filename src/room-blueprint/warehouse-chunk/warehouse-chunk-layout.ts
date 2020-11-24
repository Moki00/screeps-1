import { StructuresChunkLayout } from "../helpers/structures-layout.interface";

const warehouseChunkLayout: StructuresChunkLayout = {
  itemsInOrder: [
    {
      position: { x: 0, y: 0 },
      structure: STRUCTURE_STORAGE,
    },
    {
      position: { x: 0, y: 1 },
      structure: STRUCTURE_TERMINAL,
    },
    {
      position: { x: 0, y: 2 },
      structure: STRUCTURE_LINK,
    },
    {
      position: { x: 1, y: 0 },
      structure: STRUCTURE_NUKER,
    },
    {
      position: { x: 1, y: 2 },
      structure: STRUCTURE_FACTORY,
    },
    {
      position: { x: 2, y: 0 },
      structure: STRUCTURE_EXTENSION,
    },
    {
      position: { x: 2, y: 1 },
      structure: STRUCTURE_EXTENSION,
    },
    {
      position: { x: 2, y: 2 },
      structure: STRUCTURE_ROAD,
    },
    {
      position: { x: 1, y: 1 },
      structure: undefined,
    },
  ],
  size: {
    width: 3,
    height: 3,
  },
};

export default warehouseChunkLayout;
