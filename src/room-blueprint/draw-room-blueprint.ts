import drawStructure from "../visuals/draw-structure/draw-structure";
import { ROOM_SIZE } from "../utils/constants";
import { isVisualEnabled, VISUAL_TOGGLES_KEYS } from "../visuals/config";

function drawBackground(room: Room): void {
  room.visual.rect(0 - 0.5, 0 - 0.5, ROOM_SIZE + 1, ROOM_SIZE + 1, {
    fill: "#333388",
    opacity: 0.5,
  });
}

function drawBuildingOrder(room: Room): void {
  room.memory.roomBlueprint?.itemsInBuildOrder.forEach((item, index) => {
    room.visual.text(`${index}`, item.position.x, item.position.y, {
      color: "#ff00ff",
      font: "0.4",
      backgroundColor: "#00000044",
      backgroundPadding: 0.1,
    });
  });
}

export default function drawRoomBlueprint(room: Room): void {
  if (!isVisualEnabled(VISUAL_TOGGLES_KEYS.ROOM_PLANNER)) {
    return;
  }

  drawBackground(room);

  room.memory.roomBlueprint?.itemsInBuildOrder.forEach((roomBlueprintItem) => {
    if (!roomBlueprintItem.structure) {
      return;
    }

    drawStructure(
      new RoomPosition(
        roomBlueprintItem.position.x,
        roomBlueprintItem.position.y,
        room.name
      ),
      roomBlueprintItem.structure
    );
  });

  drawBuildingOrder(room);
}
