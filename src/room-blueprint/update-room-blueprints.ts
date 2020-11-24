import createRoomBlueprint from "./create-room-blueprint";
import Logger from "../utils/logger";
import drawRoomBlueprint from "./draw-room-blueprint";
import {
  getAnyRoomWithNoBlueprint,
  getRoomsWithBlueprint,
  isRoomWithBlueprint,
} from "./selectors";
import { isVisualEnabled, VISUAL_TOGGLES_KEYS } from "../visuals/config";

export default function updateRoomBlueprints(): void {
  if (isVisualEnabled(VISUAL_TOGGLES_KEYS.ROOM_PLANNER)) {
    getRoomsWithBlueprint().forEach((room) => {
      drawRoomBlueprint(room);
    });
  }

  const anyRoomWithoutBlueprint: Room | undefined = getAnyRoomWithNoBlueprint();

  if (!anyRoomWithoutBlueprint) {
    return;
  }

  updateRoomBlueprint(anyRoomWithoutBlueprint);
}

export function updateRoomBlueprint(room: Room): void {
  if (!isRoomWithBlueprint(room)) {
    Logger.info(`${room} doesn't have a blueprint. Creating one...`);
    createRoomBlueprint(room);
  } else {
    drawRoomBlueprint(room);
  }
}
