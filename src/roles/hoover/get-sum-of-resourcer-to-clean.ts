import getSumOfResources from '../common/get-sum-of-resources';

export default function getSumOfResourcesToClean(room: Room): ResourcesToClean {
    let energySum: number = 0;
    let mineralsSum: number = 0;

    room.find(FIND_DROPPED_RESOURCES)
        .forEach((droppedResource) => {
            if (droppedResource.resourceType === RESOURCE_ENERGY) {
                energySum += droppedResource.amount;
            } else {
                mineralsSum += droppedResource.amount;
            }
        });

    room.find(FIND_TOMBSTONES)
        .forEach((tombstone) => {
            const sumOfResources: number = getSumOfResources(tombstone);
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
