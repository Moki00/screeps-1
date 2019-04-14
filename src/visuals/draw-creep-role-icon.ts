import {getCreepIcon, ROLE_FONT_SIZE} from './config';

export function drawCreepRoleIcon(creep: Creep) {
    const char: string = getCreepIcon(creep);
    new RoomVisual(creep.room.name).text(char, creep.pos, {
        color: '#fff',
        font: `${ROLE_FONT_SIZE} Symbola`,
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
