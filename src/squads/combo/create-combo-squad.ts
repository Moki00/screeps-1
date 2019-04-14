import SimpleRoomPosition from '../../constructions/simple-room-position.interface';
import findSquadRecruitingArea from '../common/find-recruiting-area';
import ComboSquadState from './combo-squad-state';

export default function createComboSquad(room: Room) {
    const type: string = 'combo';
    const squadName: string = `${type}-squad-${Game.time}`;
    const roles: string[] = [
        'combo-squad-medic',
        'combo-squad-medic',
        'combo-squad-attacker',
        'combo-squad-attacker',
    ];
    const recruitmentPositions: SimpleRoomPosition[] = findSquadRecruitingArea(room, roles.length);
    const squadSeats: SquadMemorySeat[] = recruitmentPositions
        .map((recruitmentPosition, index) => {
            return {
                role: roles[index],
                assignedCreepId: undefined,
                recruitmentPosition,
            };
        });
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
