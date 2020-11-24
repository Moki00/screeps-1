import { StructuresChunkLayout } from "../helpers/structures-layout.interface";

const labsChunkLayout: StructuresChunkLayout = {
  itemsInOrder: [
    {
      position: { x: 1, y: 3 },
      structure: STRUCTURE_LAB,
    },
    {
      position: { x: 2, y: 3 },
      structure: STRUCTURE_LAB,
    },
    {
      position: { x: 2, y: 2 },
      structure: STRUCTURE_LAB,
    },
    {
      position: { x: 3, y: 2 },
      structure: STRUCTURE_LAB,
    },
    {
      position: { x: 3, y: 1 },
      structure: STRUCTURE_LAB,
    },

    {
      position: { x: 0, y: 2 },
      structure: STRUCTURE_LAB,
    },
    {
      position: { x: 0, y: 1 },
      structure: STRUCTURE_LAB,
    },
    {
      position: { x: 1, y: 1 },
      structure: STRUCTURE_LAB,
    },
    {
      position: { x: 1, y: 0 },
      structure: STRUCTURE_LAB,
    },
    {
      position: { x: 2, y: 0 },
      structure: STRUCTURE_LAB,
    },

    {
      position: { x: 3, y: 0 },
      structure: STRUCTURE_ROAD,
    },
    {
      position: { x: 2, y: 1 },
      structure: STRUCTURE_ROAD,
    },
    {
      position: { x: 1, y: 2 },
      structure: STRUCTURE_ROAD,
    },
    {
      position: { x: 0, y: 3 },
      structure: STRUCTURE_ROAD,
    },
  ],
  size: {
    width: 4,
    height: 4,
  },
};

export default labsChunkLayout;
