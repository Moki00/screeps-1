import SimpleRoomPosition from "../../constructions/simple-room-position.interface";
import findSquadRecruitingArea from "../common/find-recruiting-area";
import ComboSquadState from "./combo-squad-state";
import Logger from "../../utils/logger";

export default function createComboSquad(room: Room): void {
  const type = "combo";
  const squadName = `${type}-squad-${Game.time}`;
  const roles: string[] = [
    "combo-squad-medic",
    "combo-squad-medic",
    "combo-squad-attacker",
    "combo-squad-attacker",
  ];
  const recruitmentPositions:
    | SimpleRoomPosition[]
    | undefined = findSquadRecruitingArea(room, roles.length);

  if (!recruitmentPositions) {
    Logger.warning("Could not find squad recruiting area.");
    return;
  }

  const squadSeats: SquadMemorySeat[] = recruitmentPositions.map(
    (recruitmentPosition, index) => {
      return {
        role: roles[index],
        assignedCreepId: undefined,
        recruitmentPosition,
      };
    }
  );
  const comboSquadMemory: SquadMemory = {
    name: squadName,
    type,
    state: ComboSquadState.RECRUIT,
    createdAt: Game.time,
    createdInRoom: room.name,
    seats: squadSeats,
  };

  if (!Memory.squads) {
    Memory.squads = {};
  }

  Memory.squads[squadName] = comboSquadMemory;
}
