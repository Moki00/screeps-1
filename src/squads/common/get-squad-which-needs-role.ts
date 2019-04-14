export default function getSquadWhichNeedsRole(role: string): SquadMemory | undefined {
    if (!Memory.squads) {
        return;
    }

    return Object.values(Memory.squads).find((squad) => {
        return !!squad.seats.find((seat) => seat.role === role);
    });
}
