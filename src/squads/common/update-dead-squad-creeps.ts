import ComboSquadState from '../combo/combo-squad-state';

export default function updateDeadSquadCreeps(): void {
    if (!Memory.squads) {
        return;
    }

    const allKilledCreepsIds: string[] = [];
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];

        const roomEventLogs: EventItem[] = room.getEventLog();
        allKilledCreepsIds.push(...getKilledSquadCreepsIds(roomEventLogs));
    }

    for (const squadName in Memory.squads) {
        const squad: SquadMemory = Memory.squads[squadName];

        squad.seats = squad.seats.map((seat) => {
            if (!seat.assignedCreepId) {
                return seat;
            }
            if (allKilledCreepsIds.includes(seat.assignedCreepId)) {
                seat.assignedCreepId = undefined;
            }

            return seat;
        });
    }

    removeDeadSquads();
}

function removeDeadSquads(): void {
    if (!Memory.squads) {
        return;
    }

    for (const squadName in Memory.squads) {
        const sqaud: SquadMemory = Memory.squads[squadName];

        if (isSquadDead(sqaud)) {
            console.log(`Remove "${sqaud.name}" squad.`);
            delete Memory.squads[squadName];
        }
    }
}

function isSquadDead(squad: SquadMemory): boolean {
    if (squad.state === ComboSquadState.RECRUIT) {
        return false;
    }

    return !squad.seats.find((seat) => !!seat.assignedCreepId);
}

function getKilledSquadCreepsIds(eventLogs: EventItem[]): string[] {
    return eventLogs
        .filter((eventLog) => eventLog.event === EVENT_OBJECT_DESTROYED)
        .map((eventLog) => eventLog.objectId);
}
