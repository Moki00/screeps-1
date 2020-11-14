import Logger from "../../../../utils/logger";
import { getCreepPathStyle } from "../../../../visuals/config";
import { COMBO_SQUAD_ROOM_TARGET_FLAG_NAME } from "../../run-combo-squad";

export default function attack(creep: Creep): void {
  if (!Memory.squads) {
    return;
  }

  const attackFlag: Flag | undefined =
    Game.flags[COMBO_SQUAD_ROOM_TARGET_FLAG_NAME];

  if (!attackFlag) {
    return;
  }

  if (!isCreepInTargetRoom(creep, attackFlag)) {
    creep.moveTo(attackFlag, {
      reusePath: 50,
      visualizePathStyle: getCreepPathStyle(creep),
    });

    return;
  }

  if (!creep.memory.squadName) {
    return;
  }

  const squad: SquadMemory = Memory.squads[creep.memory.squadName];

  if (!squad.targetToKillId) {
    creep.moveTo(Math.floor(ROOM_WIDTH / 2), Math.floor(ROOM_HEIGHT / 2), {
      visualizePathStyle: getCreepPathStyle(creep),
    });
    return;
  }

  const targetToKill: Creep | null = Game.getObjectById<Creep>(
    squad.targetToKillId
  );

  if (!targetToKill) {
    Logger.warning(
      `"${squad.name}" has non existing kill target (id "${squad.targetToKillId}").`
    );
    return;
  }

  creep.moveTo(targetToKill, {
    visualizePathStyle: getCreepPathStyle(creep),
  });
  creep.attack(targetToKill);
}

function isCreepInTargetRoom(creep: Creep, attackFlag: Flag): boolean {
  return creep.room.name === attackFlag.pos.roomName;
}

const ROOM_WIDTH = 50;
const ROOM_HEIGHT = 50;
