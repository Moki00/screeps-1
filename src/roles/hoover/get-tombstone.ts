export default function getTombstone(creep: Creep): Tombstone | undefined {
  return creep.room.find(FIND_TOMBSTONES).find((tombstone) => {
    const hasAnythingInside = tombstone.store.getUsedCapacity() > 0;

    return hasAnythingInside;
  });
}
