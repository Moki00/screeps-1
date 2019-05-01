import {isVisualEnabled, VISUAL_TOGGLES_KEYS} from './config';

export default function drawTowerOptimalRangeVisual(tower: StructureTower): void {
    if (!isVisualEnabled(VISUAL_TOGGLES_KEYS.TOWERS)) {
        return;
    }

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
