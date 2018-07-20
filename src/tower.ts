export default function runTower(tower: StructureTower): void {
    attack(tower);
}

function attack(tower: StructureTower): void {
    const closeHostiles: Creep[] = tower.pos.findInRange(FIND_HOSTILE_CREEPS, TOWER_OPTIMAL_RANGE)
        .filter((creep) => isCreepDangerous(creep));

    if (!closeHostiles) {
        return;
    }

    tower.attack(closeHostiles[0]);
}

function isCreepDangerous(creep: Creep): boolean {
    return !!(
        creep.getActiveBodyparts(ATTACK) ||
        creep.getActiveBodyparts(RANGED_ATTACK) ||
        creep.getActiveBodyparts(CLAIM)
    );
}
