import Logger from "../../utils/logger";
import { getCreepPathStyle } from "../../visuals/config";
import recycle from "../common/recycle";
import { SETTLER_FLAG_NAME } from "./run-settler-role";

export default function upgrade(creep: Creep): void {
  const settleFlag: Flag | undefined = Game.flags[SETTLER_FLAG_NAME];
  const controller: StructureController | undefined = creep.room.controller;

  if (!settleFlag) {
    Logger.error(`${creep} can't find required "${SETTLER_FLAG_NAME}" flag.`);
    recycle(creep);
    return;
  }

  if (!controller) {
    Logger.error(`${creep} can't find controller to upgrade.`);
    recycle(creep);
    return;
  }

  creep.moveTo(controller, {
    visualizePathStyle: getCreepPathStyle(creep),
  });

  const upgradeReturnCode: ScreepsReturnCode = creep.upgradeController(
    controller
  );

  if (upgradeReturnCode === OK && controller.level === 2) {
    settleFlag.remove();
    Logger.info(
      `${creep.room} has been successfully claimed and upgraded to RCL2.`
    );
  }

  createSpawnConstructionSite(creep.room, settleFlag.pos);
}

function createSpawnConstructionSite(room: Room, position: RoomPosition): void {
  room.createConstructionSite(
    position.x,
    position.y,
    STRUCTURE_SPAWN,
    `Spawn-${room.name}-${position.x}-${position.y}`
  );
}
