import {getAnyFreeSourceId} from './constructions/harvest-base';

export function updateSpawner(spawn: StructureSpawn) {
    if (howManyCreepsShouldISpawn(spawn, 'refiller') > 0) {
        spawnRefillerCreep(spawn);
    }

    if (howManyCreepsShouldISpawn(spawn, 'builder') > 0) {
        spawnBuilderCreep(spawn);
    }

    if (doINeedHarvester(spawn.room)) {
        spawnHarvesterCreep(spawn);
    }

    if (howManyCreepsShouldISpawn(spawn, 'upgrader') > 0) {
        spawnUpgraderCreep(spawn);
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

    spawn.spawnCreep([WORK, WORK, CARRY, MOVE], name, {
        memory: {
            role: 'harvester',
            targetSourceId: getAnyFreeSourceId(spawn.room),
        },
    });
}

function spawnBuilderCreep(spawn: StructureSpawn): void {
    const name = `Builder-${Game.time}`;

    spawn.spawnCreep([WORK, CARRY, MOVE], name, {
        memory: {
            role: 'builder',
        },
    });
}

function spawnRefillerCreep(spawn: StructureSpawn): void {
    const name = `Refiller-${Game.time}`;

    spawn.spawnCreep([WORK, CARRY, MOVE], name, {
        memory: {
            role: 'refiller',
        },
    });
}

function doINeedHarvester(room: Room): boolean {
    return !!getAnyFreeSourceId(room);
}

function howManyCreepsDoINeedInRoom(role: string, room: Room): number {
    const neededRolesByRCL: {
        [role: string]: {
            [rcl: number]: number,
        },
    } = {
        upgrader: {
            1: 2,
            2: 2,
            3: 2,
            4: 2,
        },
        harvester: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
        },
        builder: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,

        },
        refiller: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
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
