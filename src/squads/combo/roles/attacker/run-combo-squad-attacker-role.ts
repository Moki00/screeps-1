import { goToSquadRecruitmentPosition } from "../../../common/go-to-squad-recruitment-position";
import ComboSquadState from "../../combo-squad-state";
import attack from "./attack";
import ComboSquadAttackerState from "./combo-squad-attacker-state";

export default function runComboSquadAttackerRole(creep: Creep): void {
  if (!creep.memory.state) {
    creep.memory.state = ComboSquadAttackerState.GO_TO_RECRUIT_POSITION;
  }

  switch (creep.memory.state) {
    case ComboSquadAttackerState.GO_TO_RECRUIT_POSITION:
      goToSquadRecruitmentPosition(creep, {
        onStandInLineCreepState: ComboSquadAttackerState.AWAIT,
        onAllStandInLineSquadState: ComboSquadState.FIGHT,
      });
      break;
    case ComboSquadAttackerState.AWAIT:
      break;
    case ComboSquadAttackerState.FIGHT:
      attack(creep);
      break;
  }
}
