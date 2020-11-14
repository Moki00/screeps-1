import { doesRampartRequireRepair } from "../../constructions/rampart";
import { getRoomEarlyStorageContainer } from "../../constructions/storage";
import { getUpgraderContainer } from "../../constructions/upgrade-base";
import Logger from "../../utils/logger";
import { getCreepPathStyle } from "../../visuals/config";
import BuilderRoleState from "./builder-role-state";

export default function repair(creep: Creep): void {
  if (!creep.memory.repairTargetObjectId) {
    const structure: Structure | undefined = findRepairTarget(creep);
    creep.memory.repairTargetObjectId = structure ? structure.id : undefined;
  }

  if (!creep.memory.repairTargetObjectId) {
    return;
  }

  const repairTarget: Structure | null = Game.getObjectById(
    creep.memory.repairTargetObjectId
  );
  if (!repairTarget || repairTarget.hits === repairTarget.hitsMax) {
    creep.memory.repairTargetObjectId = undefined;
    return;
  }

  if (!repairTarget) {
    Logger.warning(
      `${creep} repair target doesn't exist. Was it destroyed in the meantime?`
    );
    creep.memory.repairTargetObjectId = undefined;
    creep.memory.state = BuilderRoleState.BUILD;
    return;
  }

  const repairReturnCode: ScreepsReturnCode = creep.repair(repairTarget);
  switch (repairReturnCode) {
    case ERR_NOT_IN_RANGE:
      creep.moveTo(repairTarget, {
        visualizePathStyle: getCreepPathStyle(creep),
      });
      break;
  }

  if (creep.room.find(FIND_CONSTRUCTION_SITES)) {
    creep.memory.state = BuilderRoleState.BUILD;
  }

  if (creep.carry.energy === 0) {
    creep.memory.repairTargetObjectId = undefined;
    creep.memory.state = BuilderRoleState.FIND_ENERGY;
  }
}

function findRepairTarget(creep: Creep): Structure | undefined {
  const container: StructureContainer | undefined = findContainerToRepair(
    creep
  );
  if (container) {
    return container;
  }

  const rampartToRepair: StructureRampart | undefined = findRampartToRepair(
    creep
  );
  if (rampartToRepair) {
    return rampartToRepair;
  }

  return undefined;
}

function findContainerToRepair(creep: Creep): StructureContainer | undefined {
  const earlyStorageContainer:
    | StructureContainer
    | undefined = getRoomEarlyStorageContainer(creep.room);

  if (
    earlyStorageContainer &&
    earlyStorageContainer.hits < earlyStorageContainer.hitsMax
  ) {
    return earlyStorageContainer;
  }

  const upgraderContainer:
    | StructureContainer
    | undefined = getUpgraderContainer(creep.room);
  if (upgraderContainer && upgraderContainer.hits < upgraderContainer.hitsMax) {
    return upgraderContainer;
  }

  return undefined;
}

function findRampartToRepair(creep: Creep): StructureRampart | undefined {
  return creep.room
    .find<StructureRampart>(FIND_MY_STRUCTURES)
    .filter((myStructure) => {
      return (
        myStructure.structureType === STRUCTURE_RAMPART &&
        doesRampartRequireRepair(myStructure)
      );
    })
    .sort(sortByLeastHits)
    .find(() => true);
}

function sortByLeastHits(structureA: Structure, structureB: Structure): number {
  return structureA.hits - structureB.hits;
}
