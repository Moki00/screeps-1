import { COMBO_SQUAD_ROOM_TARGET_FLAG_NAME } from "./run-combo-squad";

export default function isComboSquadNeeded(): boolean {
  if (!Memory.squads) {
    Memory.squads = {};
  }

  const comboSquadFlag: Flag | undefined =
    Game.flags[COMBO_SQUAD_ROOM_TARGET_FLAG_NAME];

  return Object.values(Memory.squads).length === 0 && !!comboSquadFlag;
}
