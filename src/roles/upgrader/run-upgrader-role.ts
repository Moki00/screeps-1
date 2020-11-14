import findEnergy from "../common/find-energy";
import harvest from "./harvest";
import upgrade from "./upgrade";
import UpgraderRoleState from "./upgrader-role-state";

function runUpgraderRole(creep: Creep): void {
  switch (creep.memory.state) {
    case UpgraderRoleState.UPGRADE:
      upgrade(creep);
      break;
    case UpgraderRoleState.FIND_ENERGY:
      findEnergy(creep, {
        onWithdrawState: UpgraderRoleState.UPGRADE,
        onNotEnoughResourcesState: UpgraderRoleState.HARVEST,
        reserveEnergyForEmptyExtensions: true,
      });
      break;
    case UpgraderRoleState.HARVEST:
      harvest(creep);
      break;
    default:
      findEnergy(creep, {
        onWithdrawState: UpgraderRoleState.UPGRADE,
        onNotEnoughResourcesState: UpgraderRoleState.HARVEST,
        reserveEnergyForEmptyExtensions: true,
      });
  }
}

export default runUpgraderRole;
