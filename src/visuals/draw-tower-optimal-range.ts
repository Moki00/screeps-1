export default function drawTowerOptimalRangeVisual(tower: StructureTower): void {
    const visualRange: number = (TOWER_OPTIMAL_RANGE + 0.5);
    tower.room.visual.rect(
        tower.pos.x - visualRange,
        tower.pos.y - visualRange,
        2 * visualRange,
        2 * visualRange,
        towerAttackRangeStyle,
    );
}

const towerAttackRangeStyle: PolyStyle = {
    fill: 'cadetblue',
    opacity: 0.05,
    stroke: 'cadetblue',
    strokeWidth: 0,
    lineStyle: 'solid',
};
