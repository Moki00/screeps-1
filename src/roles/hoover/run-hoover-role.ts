import HooverRoleState from "./hoover-role-state";
import pickUpResources from "./pick-up-resources";
import storeResources from "./store-resources";

export default function runHooverRole(creep: Creep): void {
  switch (creep.memory.state) {
    case HooverRoleState.CLEAN:
      pickUpResources(creep);
      break;
    case HooverRoleState.STORE:
      storeResources(creep);
      break;
    default:
      pickUpResources(creep);
  }
}
