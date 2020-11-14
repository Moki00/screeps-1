import findEnergy from "../common/find-energy";
import claim from "./claim";
import SettlerRoleState from "./settler-role-state";
import upgrade from "./upgrade";

export default function runSettlerRole(creep: Creep): void {
  if (!creep.memory.state) {
    creep.memory.state = SettlerRoleState.FIND_ENERGY;
  }

  switch (creep.memory.state) {
    case SettlerRoleState.FIND_ENERGY:
      findEnergy(creep, {
        onWithdrawState: SettlerRoleState.CLAIM,
        onNotEnoughResourcesState: SettlerRoleState.FIND_ENERGY,
      });
      break;
    case SettlerRoleState.CLAIM:
      claim(creep);
      break;
    case SettlerRoleState.UPGRADE:
      upgrade(creep);
      break;
  }
}

export const SETTLER_FLAG_NAME = "settle";
