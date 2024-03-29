import { getRoomEarlyStorageContainer } from "../../constructions/storage";
import { getCreepPathStyle } from "../../visuals/config";
import getMostFilledHarvesterContainer from "./get-most-filled-harvester-container";

export default function findEnergy(
  creep: Creep,
  findEnergyOptions: FindEnergyConfiguration
): void {
  const reserveEnergyForEmptyExtensions: boolean =
    findEnergyOptions.reserveEnergyForEmptyExtensions || false;
  const targetRoom: Room = findEnergyOptions.targetRoom
    ? Game.rooms[findEnergyOptions.targetRoom]
    : creep.room;

  let withdrawTarget: StructureContainer | StructureStorage | undefined;
  if (creep.memory.withdrawTargetId) {
    withdrawTarget = Game.getObjectById(creep.memory.withdrawTargetId) as
      | StructureContainer
      | StructureStorage
      | undefined;
  } else {
    withdrawTarget = findTarget(creep, targetRoom);
    if (withdrawTarget) {
      creep.memory.withdrawTargetId = withdrawTarget.id;
    }
  }

  if (!withdrawTarget) {
    creep.memory.state = findEnergyOptions.onNotEnoughResourcesState;
    return;
  }

  let energyToReserve = 0;
  if (reserveEnergyForEmptyExtensions) {
    energyToReserve += getExtensionsEmptySpace(targetRoom);
  }
  const withdrawAmount: number = Math.max(
    0,
    Math.min(creep.carryCapacity, withdrawTarget.store.energy - energyToReserve)
  );

  const withdrawReturnCode: ScreepsReturnCode = creep.withdraw(
    withdrawTarget,
    RESOURCE_ENERGY,
    withdrawAmount
  );
  switch (withdrawReturnCode) {
    case OK:
      creep.memory.state = findEnergyOptions.onWithdrawState;
      creep.memory.withdrawTargetId = undefined;
      break;
    case ERR_NOT_IN_RANGE:
      creep.moveTo(withdrawTarget, {
        visualizePathStyle: getCreepPathStyle(creep),
      });
      break;
    case ERR_NOT_ENOUGH_RESOURCES:
      creep.memory.withdrawTargetId = undefined;
      creep.memory.state = findEnergyOptions.onNotEnoughResourcesState;
      break;
  }
}

function findTarget(
  creep: Creep,
  targetRoom: Room
): StructureContainer | StructureStorage | undefined {
  if (creep.memory.withdrawTargetId) {
    return Game.getObjectById(creep.memory.withdrawTargetId) as
      | StructureContainer
      | StructureStorage
      | undefined;
  }

  const earlyStorageContainer:
    | StructureContainer
    | undefined = getRoomEarlyStorageContainer(targetRoom);
  if (earlyStorageContainer && earlyStorageContainer.store.energy) {
    return earlyStorageContainer;
  }

  if (targetRoom.storage && targetRoom.storage.store.energy) {
    return targetRoom.storage;
  }

  return getMostFilledHarvesterContainer(creep);
}

function getExtensionsEmptySpace(room: Room): number {
  return room
    .find<StructureExtension>(FIND_MY_STRUCTURES)
    .filter((structure) => structure.structureType === STRUCTURE_EXTENSION)
    .reduce<number>((unfilledEnergySum, currentStructure) => {
      const unfilledEnergy: number =
        currentStructure.energyCapacity - currentStructure.energy;
      return unfilledEnergySum + unfilledEnergy;
    }, 0);
}

interface FindEnergyConfiguration {
  onWithdrawState: string;
  onNotEnoughResourcesState: string;
  reserveEnergyForEmptyExtensions?: boolean;
  targetRoom?: string;
}
