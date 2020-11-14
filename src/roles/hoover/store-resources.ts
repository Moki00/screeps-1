import { getRoomEarlyStorageContainer } from "../../constructions/storage";
import isCreepCarryingAnything from "../../utils/is-creep-carrying-anything";
import Logger from "../../utils/logger";
import { getCreepPathStyle } from "../../visuals/config";
import recycle from "../common/recycle";
import transferAllResources from "../common/transfer-all-resources";
import getSumOfResourcesToClean from "./get-sum-of-resourcer-to-clean";
import HooverRoleState from "./hoover-role-state";

export default function storeResources(creep: Creep): void {
  const target: StructureStorage | StructureContainer | undefined =
    creep.room.storage || getRoomEarlyStorageContainer(creep.room);

  if (!target) {
    Logger.warning(`storage is the only target and it doesn't exists!`);
    return;
  }

  const transferReturnCode: ScreepsReturnCode = transferAllResources(
    creep,
    target
  );
  switch (transferReturnCode) {
    case OK:
      break;
    case ERR_NOT_IN_RANGE:
      creep.moveTo(target, {
        visualizePathStyle: getCreepPathStyle(creep),
      });
      break;
  }

  if (
    !isCreepCarryingAnything(creep) &&
    getSumOfResourcesToClean(creep.room).all === 0
  ) {
    recycle(creep);
  }

  if (!isCreepCarryingAnything(creep)) {
    creep.memory.state = HooverRoleState.CLEAN;
  }
}
