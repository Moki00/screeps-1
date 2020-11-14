import { getCreepPathStyle } from "../../visuals/config";
import RefillerRoleState from "./refiller-role-state";

export default function refillEnergy(creep: Creep): void {
  const refillTarget:
    | StructureSpawn
    | StructureExtension
    | StructureTower
    | null = getRoomEnergyRefillTarget(creep);
  if (refillTarget) {
    const energyToFull: number =
      refillTarget.energyCapacity - refillTarget.energy;
    const transferReturnCode: ScreepsReturnCode = creep.transfer(
      refillTarget,
      RESOURCE_ENERGY,
      Math.min(creep.carry.energy, energyToFull)
    );
    switch (transferReturnCode) {
      case ERR_NOT_IN_RANGE:
        creep.moveTo(refillTarget, {
          visualizePathStyle: getCreepPathStyle(creep),
        });
        break;
    }
  } else {
    creep.memory.state = RefillerRoleState.REFILL_UPGRADER;
  }

  if (creep.carry.energy === 0) {
    creep.memory.state = RefillerRoleState.FIND_ENERGY;
  }
}

export function getRoomEnergyRefillTarget(
  creep: Creep
): StructureSpawn | StructureExtension | StructureTower | null {
  const spawns: StructureSpawn[] = creep.room
    .find(FIND_MY_SPAWNS)
    .filter((spawn) => spawn.energy < spawn.energyCapacity)
    .sort((a, b) => b.energy - a.energy);

  if (spawns.length) {
    return spawns[0];
  }

  const structures: AnyStructure[] = creep.room.find(FIND_STRUCTURES);

  const emptyExtensions: StructureExtension[] = structures.filter(
    (structure) => {
      return (
        structure.structureType === STRUCTURE_EXTENSION &&
        structure.energy < structure.energyCapacity
      );
    }
  ) as StructureExtension[];

  const closestEmptyExtension: StructureExtension | null = creep.pos.findClosestByRange(
    emptyExtensions
  );

  if (closestEmptyExtension) {
    return closestEmptyExtension;
  }

  const towers: StructureTower[] = structures.filter((structure) => {
    return (
      structure.structureType === STRUCTURE_TOWER &&
      structure.energy < structure.energyCapacity
    );
  }) as StructureTower[];

  if (towers.length) {
    return towers[0];
  }

  return null;
}
