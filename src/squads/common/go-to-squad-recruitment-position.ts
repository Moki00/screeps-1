import Logger from '../../utils/logger';
import {getCreepPathStyle} from '../../visuals/config';

export function goToSquadRecruitmentPosition(creep: Creep, options: GoToSquadLineOptions): void {
    if (!Memory.squads) {
        return;
    }

    if (!creep.memory.squadName) {
        Logger.warning(`creep "${creep.memory.role}" has no required squad data!`);
        return;
    }

    const squad: SquadMemory = Memory.squads[creep.memory.squadName];
    const squadSeat: SquadMemorySeat | undefined =
        Memory.squads[creep.memory.squadName].seats
            .find((seat) => seat.assignedCreepId === creep.id);

    if (!squadSeat) {
        assignCreepToSquadSeat(creep, squad);
        return;
    }

    const recruitmentPosition: RoomPosition = new RoomPosition(
        squadSeat.recruitmentPosition.x,
        squadSeat.recruitmentPosition.y,
        squadSeat.recruitmentPosition.room || creep.room.name,
    );
    creep.moveTo(recruitmentPosition, {
        visualizePathStyle: getCreepPathStyle(creep),
    });

    if (creep.pos.isEqualTo(recruitmentPosition)) {
        creep.memory.state = options.onStandInLineCreepState;

        if (isSquadFull(squad)) {
            squad.state = options.onAllStandInLineSquadState;
        }
    }
}

function assignCreepToSquadSeat(creep: Creep, squad: SquadMemory): void {
    const assignedSeatIndex: number = squad.seats
        .findIndex((seat) => {
            return !seat.assignedCreepId && seat.role === creep.memory.role;
        });

    if (assignedSeatIndex === -1) {
        return;
    }

    squad.seats[assignedSeatIndex].assignedCreepId = creep.id;
}

function isSquadFull(squad: SquadMemory): boolean {
    const anyFreeSeat: SquadMemorySeat | undefined = squad.seats.find((seat) => !seat.assignedCreepId);
    return !anyFreeSeat;
}

interface GoToSquadLineOptions {
    onStandInLineCreepState: string;
    onAllStandInLineSquadState: string;
}
