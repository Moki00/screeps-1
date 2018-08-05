export default function getTombstone(creep: Creep): Tombstone | undefined {
    return creep.room
        .find(FIND_TOMBSTONES)
        .find((tombstone) => {
            const hasAnythingInside: boolean = !!Object.values(tombstone.store)
                .find((resourceAmount) => resourceAmount > 0);

            return hasAnythingInside;
        });
}
