export function drawCreepRoleVisuals(creep: Creep) {
    const char: string = charsByRole[creep.memory.role];
    new RoomVisual(creep.room.name).text(char, creep.pos, {
        color: '#fff',
        font: '0.5 Symbola',
        stroke: '#000',
        strokeWidth: 0.05,
        backgroundColor: 'transparent',
        backgroundPadding: 0,
        align: 'center',
        opacity: 0.9,
    });
}

export function scanAndDrawRoleVisuals() {
    Object.values(Game.creeps).forEach(drawCreepRoleVisuals);
}

const charsByRole: CharsByRole = {
    'harvester': '⛏',
    'refiller': '💯',
    'upgrader': '🔝',
    'builder': '🔨',
    'harvest-transporter': '🚚',
};

interface CharsByRole {
    [role: string]: string;
}
