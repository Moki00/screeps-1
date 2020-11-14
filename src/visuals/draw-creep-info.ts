import { isVisualEnabled, VISUAL_TOGGLES_KEYS } from "./config";
import drawMultilineText from "./draw-multiline-text";

export default function drawCreepInfo(creep: Creep): void {
  if (!isVisualEnabled(VISUAL_TOGGLES_KEYS.CREEPS_MEMORY)) {
    return;
  }

  const visibleData: CreepMemory = filterInternalMemoryProperties(creep.memory);

  drawMultilineText(JSON.stringify(visibleData, null, 2), creep.pos);
}

const INTERNAL_MOVE_PROPERTY = "_move";

function filterInternalMemoryProperties(creepMemory: CreepMemory): CreepMemory {
  const copiedMemory: CreepMemory = Object.assign({}, creepMemory);
  delete copiedMemory[INTERNAL_MOVE_PROPERTY];
  return copiedMemory;
}
