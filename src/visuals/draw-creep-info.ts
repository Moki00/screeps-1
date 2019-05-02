import {isVisualEnabled, VISUAL_TOGGLES_KEYS} from './config';
import drawMultilineText from './draw-multiline-text';

export default function drawCreepInfo(creep: Creep): void {
    if (!isVisualEnabled(VISUAL_TOGGLES_KEYS.CREEPS_MEMORY)) {
        return;
    }

    const visibleData: object = filterInternalMemoryProperties(creep.memory);

    drawMultilineText(JSON.stringify(visibleData, null, 2), creep.pos);
}

const INTERNAL_MEMORY_PROPERTIES: string[] = ['_move'];

function filterInternalMemoryProperties(creepMemory: CreepMemory): object {
    const copiedMemory = Object.assign({}, creepMemory);

    Object.values(INTERNAL_MEMORY_PROPERTIES).forEach((internalProperty) => {
        // @ts-ignore
        delete copiedMemory[internalProperty];
    });

    return copiedMemory;
}
