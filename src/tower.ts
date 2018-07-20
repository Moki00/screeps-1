import {towerAttackRangeStyle} from './visuals';

export default function runTower(tower: StructureTower): void {
    attack(tower);
}

function attack(tower: StructureTower): void {
    drawAttackRangeVisual(tower);

    const closeHostiles: Creep[] = tower.pos.findInRange(FIND_HOSTILE_CREEPS, TOWER_OPTIMAL_RANGE)
        .filter((creep) => isCreepDangerous(creep));

    if (!closeHostiles) {
        return;
    }

    tower.attack(closeHostiles[0]);
}

function drawAttackRangeVisual(tower: StructureTower): void {
    const visualRange: number = (TOWER_OPTIMAL_RANGE + 0.5);
    tower.room.visual.rect(
        tower.pos.x - visualRange,
        tower.pos.y - visualRange,
        2 * visualRange,
        2 * visualRange,
        towerAttackRangeStyle,
    );
}

function isCreepDangerous(creep: Creep): boolean {
    return !!(
        creep.getActiveBodyparts(ATTACK) ||
        creep.getActiveBodyparts(RANGED_ATTACK) ||
        creep.getActiveBodyparts(CLAIM)
    );
}
