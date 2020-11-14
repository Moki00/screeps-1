import { first } from "lodash";

export default function getMostFilledHarvesterContainer(
  creep: Creep
): StructureContainer | undefined {
  return first(
    creep.room
      .find<StructureContainer>(FIND_STRUCTURES)
      .filter((structure) => {
        const isItHarvestersContainer = !!Object.values(
          creep.room.memory.sources
        ).find((sourceBase) => {
          return (
            sourceBase.harvestingPosition.x === structure.pos.x &&
            sourceBase.harvestingPosition.y === structure.pos.y
          );
        });
        return (
          structure.structureType === STRUCTURE_CONTAINER &&
          isItHarvestersContainer
        );
      })
      .sort((a, b) => {
        const energyA = a.store.energy;
        const energyB = b.store.energy;

        if (energyA === energyB) {
          const distanceA: number = a.pos.findPathTo(creep, {
            ignoreCreeps: true,
          }).length;
          const distanceB: number = b.pos.findPathTo(creep, {
            ignoreCreeps: true,
          }).length;
          return distanceA - distanceB;
        }

        return energyB - energyA;
      })
  );
}
