import Logger from "../../utils/logger";
import runComboSquad from "../combo/run-combo-squad";

export default function runSquads(): void {
  if (!Memory.squads) {
    Memory.squads = {};
  }

  Object.values(Memory.squads).forEach((squad) => {
    switch (squad.type) {
      case "combo":
        runComboSquad(squad);
        break;
      default:
        Logger.warning(`Unknown "${squad.type}" squad!`);
        break;
    }
  });
}
