export function updateSpawner(spawn: StructureSpawn) {
    if (howManyCreepsShouldISpawn(spawn, 'upgrader') > 0) {
        spawnUpgraderCreep(spawn);
    }

    if (howManyCreepsShouldISpawn(spawn, 'harvester') > 0) {
        spawnHarvesterCreep(spawn);
    }
}

function spawnUpgraderCreep(spawn: StructureSpawn): void {
    const name = `Upgrader-${Game.time}`;

    spawn.spawnCreep([WORK, CARRY, MOVE], name, {
        memory: {
            role: 'upgrader',
            ticksSinceLastUpgrade: 0,
        },
    });
}

function spawnHarvesterCreep(spawn: StructureSpawn): void {
    const name = `Harvester-${Game.time}`;

    spawn.spawnCreep([WORK, CARRY, MOVE], name, {
        memory: {
            role: 'harvester',
        },
    });
}

function howManyCreepsDoINeedInRoom(role: string, room: Room): number {
    const neededRolesByRCL: {
        [role: string]: {
            [rcl: number]: number,
        },
    } = {
        upgrader: {
            1: 4,
            2: 3,
            3: 1,
        },
        harvester: {
            1: 1,
            2: 1,
            3: 1,
        },
    };

    if (!room.controller) {
        return 0;
    }

    return neededRolesByRCL[role][room.controller.level];
}

function howManyCreepsShouldISpawn(spawn: StructureSpawn, role: string): number {
    const howManyDoIHave: number = spawn.room.find(FIND_MY_CREEPS, {
        filter: (creep: Creep) => creep.memory.role === role,
    }).length;
    const howManyDoINeed: number = howManyCreepsDoINeedInRoom(role, spawn.room);
    // console.log(`role: ${role}; have: ${howManyDoIHave}; need: ${howManyDoINeed};`)
    return howManyDoINeed - howManyDoIHave;
}
