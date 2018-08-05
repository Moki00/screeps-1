import getSumOfResources from '../common/get-sum-of-resources';

export default function getSumOfResourcesToClean(room: Room): number {
    let sum: number = 0;

    room.find(FIND_DROPPED_RESOURCES)
        .forEach((droppedEnergy) => {
            sum += droppedEnergy.amount;
        });

    room.find(FIND_TOMBSTONES)
        .forEach((tombstone) => {
            sum += getSumOfResources(tombstone);
        });

    return sum;
}
