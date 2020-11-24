import drawExtension from "./constructions/draw-extension";
import drawUnknownStructure from "./constructions/draw-unknown-structure";
import drawRoad from "./constructions/draw-road";
import drawSpawn from "./constructions/draw-spawn";
import drawContainer from "./constructions/draw-container";
import drawLink from "./constructions/draw-link";
import drawRampart from "./constructions/draw-rampart";
import drawLab from "./constructions/draw-lab";
import drawExtractor from "./constructions/draw-extractor";
import drawStorage from "./constructions/draw-storage";
import drawNuker from "./constructions/draw-nuker";
import drawFactory from "./constructions/draw-factory";
import drawTerminal from "./constructions/draw-terminal";
import drawObserver from "./constructions/draw-observer";
import drawPowerSpawn from "./constructions/draw-power-spawn";
import drawTower from "./constructions/draw-tower";

const drawFunctionsByStructureConstant: {
  [structureConstant: string]: (roomPosition: RoomPosition) => void;
} = {
  [STRUCTURE_EXTENSION]: drawExtension,
  [STRUCTURE_ROAD]: drawRoad,
  [STRUCTURE_SPAWN]: drawSpawn,
  [STRUCTURE_CONTAINER]: drawContainer,
  [STRUCTURE_LINK]: drawLink,
  [STRUCTURE_RAMPART]: drawRampart,
  [STRUCTURE_LAB]: drawLab,
  [STRUCTURE_EXTRACTOR]: drawExtractor,
  [STRUCTURE_STORAGE]: drawStorage,
  [STRUCTURE_NUKER]: drawNuker,
  [STRUCTURE_FACTORY]: drawFactory,
  [STRUCTURE_TERMINAL]: drawTerminal,
  [STRUCTURE_OBSERVER]: drawObserver,
  [STRUCTURE_POWER_SPAWN]: drawPowerSpawn,
  [STRUCTURE_TOWER]: drawTower,
};

export default function drawStructure(
  roomPosition: RoomPosition,
  structureConstant: StructureConstant | undefined
): void {
  if (!structureConstant) {
    return;
  }

  const drawFunction = drawFunctionsByStructureConstant[structureConstant];

  if (drawFunction) {
    drawFunction(roomPosition);
  } else {
    drawUnknownStructure(roomPosition);
  }
}
