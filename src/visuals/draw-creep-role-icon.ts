import {getCreepIcon} from './config';

export function drawCreepRoleIcon(creep: Creep) {
    const char: string = getCreepIcon(creep);
    new RoomVisual(creep.room.name).text(char, creep.pos, {
        color: '#fff',
        font: '0.5 Symbola',
        stroke: '#000',
        strokeWidth: 0.05,
        backgroundColor: 'transparent',
        backgroundPadding: 0,
        align: 'center',
        opacity: 0.6,
    });
}

export function scanAndDrawRoleIcons() {
    Object.values(Game.creeps).forEach(drawCreepRoleIcon);
}
