export function doesRampartRequireRepair(rampart: StructureRampart): boolean {
    return getRampartHitsToRepair(rampart) > 0;
}

export function getRampartHitsToRepair(rampart: StructureRampart): number {
    const desiredHits: number = rampart.hitsMax / 100;

    return desiredHits - rampart.hits;
}
