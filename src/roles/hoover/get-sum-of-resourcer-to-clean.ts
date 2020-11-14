export default function getSumOfResourcesToClean(room: Room): ResourcesToClean {
  let energySum = 0;
  let mineralsSum = 0;

  room.find(FIND_DROPPED_RESOURCES).forEach((droppedResource) => {
    if (droppedResource.resourceType === RESOURCE_ENERGY) {
      energySum += droppedResource.amount;
    } else {
      mineralsSum += droppedResource.amount;
    }
  });

  room.find(FIND_TOMBSTONES).forEach((tombstone) => {
    const sumOfResources: number = tombstone.store.getUsedCapacity();
    energySum += tombstone.store.energy;
    mineralsSum += sumOfResources - tombstone.store.energy;
  });

  return {
    energy: energySum,
    minerals: mineralsSum,
    all: energySum + mineralsSum,
  };
}

export interface ResourcesToClean {
  energy: number;
  minerals: number;
  all: number;
}
