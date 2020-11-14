import {
  getCreepIcon,
  isVisualEnabled,
  ROLE_FONT_SIZE,
  VISUAL_TOGGLES_KEYS,
} from "./config";

export function drawCreepRoleIcon(creep: Creep): void {
  if (!isVisualEnabled(VISUAL_TOGGLES_KEYS.ROLE_ICONS)) {
    return;
  }

  const char: string = getCreepIcon(creep);
  new RoomVisual(creep.room.name).text(char, creep.pos, {
    color: "#fff",
    font: `${ROLE_FONT_SIZE} Symbola`,
    stroke: "#000",
    strokeWidth: 0.05,
    backgroundColor: "transparent",
    backgroundPadding: 0,
    align: "center",
    opacity: 0.6,
  });
}

export function scanAndDrawRoleIcons(): void {
  Object.values(Game.creeps).forEach(drawCreepRoleIcon);
}
