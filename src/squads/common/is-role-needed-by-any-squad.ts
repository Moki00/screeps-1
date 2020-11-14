import ComboSquadState from "../combo/combo-squad-state";

export default function isRoleNeededByAnySquad(role: string): boolean {
  if (!Memory.squads) {
    return false;
  }

  return !!Object.values(Memory.squads).find((squad) => {
    if (squad.state !== ComboSquadState.RECRUIT) {
      return false;
    }

    return !!squad.seats.find((seat) => {
      return seat.role === role && !seat.assignedCreepId;
    });
  });
}
