import { getRoomWithMyClosestStorageFromPosition } from "../../constructions/rooms";
import Logger from "../../utils/logger";
import { getCreepPathStyle } from "../../visuals/config";
import recycle from "../common/recycle";
import LooterState from "./looter-state";

export function secureLoot(creep: Creep): void {
  const storageRoom: Room | undefined = getRoomWithMyClosestStorageFromPosition(
    creep.pos
  );

  if (!storageRoom) {
    Logger.warning("No storage room to secure loot!");
    return;
  }

  const transferTarget: StructureStorage | undefined = storageRoom.storage;
  if (!transferTarget) {
    Logger.warning("No storage to secure loot!");
    return;
  }

  const transferCode: ScreepsReturnCode = creep.transfer(
    transferTarget,
    RESOURCE_ENERGY
  );
  switch (transferCode) {
    case ERR_NOT_ENOUGH_ENERGY:
      creep.memory.state = LooterState.LOOT;
      if (creep.ticksToLive && creep.ticksToLive < TICKS_TO_TRAVEL_BOTH_WAYS) {
        recycle(creep);
      }
      break;
    case ERR_NOT_IN_RANGE:
      creep.moveTo(transferTarget, {
        reusePath: 50,
        visualizePathStyle: getCreepPathStyle(creep),
      });
      break;
  }
}

const TICKS_TO_TRAVEL_BOTH_WAYS = 400; // TODO: estimate it
