import { goToSquadRecruitmentPosition } from "../../../common/go-to-squad-recruitment-position";
import ComboSquadState from "../../combo-squad-state";
import ComboSquadAttackerState from "../attacker/combo-squad-attacker-state";
import ComboSquadMedicState from "./combo-squad-medic-state";
import heal from "./heal";

export default function runComboSquadMedicRole(creep: Creep): void {
  if (!creep.memory.state) {
    creep.memory.state = ComboSquadAttackerState.GO_TO_RECRUIT_POSITION;
  }

  switch (creep.memory.state) {
    case ComboSquadMedicState.GO_TO_RECRUIT_POSITION:
      goToSquadRecruitmentPosition(creep, {
        onStandInLineCreepState: ComboSquadMedicState.HEAL,
        onAllStandInLineSquadState: ComboSquadState.FIGHT,
      });
      break;
    case ComboSquadMedicState.AWAIT:
      break;
    case ComboSquadMedicState.HEAL:
      heal(creep);
      break;
  }
}
