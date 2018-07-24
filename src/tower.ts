import drawTowerOptimalRangeVisual from './visuals/draw-tower-optimal-range';

export default function runTower(tower: StructureTower): void {
    const hasAttacked: boolean = attack(tower);

    if (!hasAttacked) {
        heal(tower);
    }
}

function attack(tower: StructureTower): boolean {
    drawTowerOptimalRangeVisual(tower);

    const closeHostiles: Creep[] = tower.pos.findInRange(FIND_HOSTILE_CREEPS, TOWER_OPTIMAL_RANGE)
        .filter((creep) => isCreepDangerous(creep));

    if (!closeHostiles) {
        return false;
    }

    const attackReturnCode: ScreepsReturnCode = tower.attack(closeHostiles[0]);

    return attackReturnCode === OK;
}

function heal(tower: StructureTower): void {
    const areHostileCreepsPresent: boolean = !!tower.room.find(FIND_HOSTILE_CREEPS).length;

    const hurtCreep: Creep | undefined =
        (areHostileCreepsPresent ?
            tower.pos.findInRange(FIND_MY_CREEPS, TOWER_OPTIMAL_RANGE)
            :
            tower.room.find(FIND_MY_CREEPS)
        ).find((creep) => creep.hits < creep.hitsMax);

    if (hurtCreep) {
        tower.heal(hurtCreep);
    }
}

function isCreepDangerous(creep: Creep): boolean {
    return !!(
        creep.getActiveBodyparts(ATTACK) ||
        creep.getActiveBodyparts(RANGED_ATTACK) ||
        creep.getActiveBodyparts(CLAIM)
    );
}
