import {isVisualEnabled, VISUAL_TOGGLES_KEYS} from './config';
import drawMultilineText from './draw-multiline-text';

export default function drawHarvestBaseInfo(room: Room): void {
    if (!isVisualEnabled(VISUAL_TOGGLES_KEYS.SOURCES_MEMORY)) {
        return;
    }

    if (!room.memory.sources) {
        return;
    }

    Object.values(room.memory.sources).forEach((sourceMemory) => {
        const source: Source | null = Game.getObjectById(sourceMemory.sourceId);
        if (!source) {
            return;
        }

        drawMultilineText(JSON.stringify(sourceMemory, null, 2), source.pos);
    });
}
