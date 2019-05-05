import {isVisualEnabled, VISUAL_TOGGLES_KEYS} from './config';
import drawMultilineText from './draw-multiline-text';

export default function drawHarvestBaseInfo(roomName: string): void {
    if (!isVisualEnabled(VISUAL_TOGGLES_KEYS.SOURCES_MEMORY)) {
        return;
    }

    if (!Memory.rooms[roomName] || !Memory.rooms[roomName].sources) {
        return;
    }

    Object.values(Memory.rooms[roomName].sources).forEach((sourceMemory) => {
        const source: Source | null = Game.getObjectById(sourceMemory.sourceId);
        if (!source) {
            return;
        }

        drawMultilineText(
            JSON.stringify(sourceMemory, null, 2),
            new RoomPosition(
                sourceMemory.harvestingPosition.x,
                sourceMemory.harvestingPosition.y,
                roomName,
            ),
        );
    });
}
