import {getAnySourceIdWithoutHarvester, getAnySourceIdWithoutTransporter} from '../constructions/harvest-base';
import stripBodyParts from './helpers/strip-body-parts';

export default function updateSpawner(spawn: StructureSpawn) {
    if (spawn.room.energyAvailable < SPAWN_ENERGY_CAPACITY) {
        return;
    }

    if (doINeedHarvestTransporter(spawn.room)) {
        spawnHarvestTransporter(spawn);
    }

    if (howManyCreepsShouldISpawn(spawn, 'builder') > 0) {
        spawnBuilderCreep(spawn);
    }

    if (doINeedHarvester(spawn.room)) {
        spawnHarvesterCreep(spawn);
    }

    if (doINeedUpgrader(spawn.room)) {
        spawnUpgraderCreep(spawn);
    }

    if (howManyCreepsShouldISpawn(spawn, 'refiller') > 0) {
        spawnRefillerCreep(spawn);
    }
}

function spawnUpgraderCreep(spawn: StructureSpawn): void {
    const name = `Upgrader-${Game.time}`;

    spawn.spawnCreep(
        stripBodyParts(
            [MOVE, WORK, WORK, MOVE, WORK, MOVE, WORK, WORK, WORK, MOVE, CARRY],
            {
                maxEnergyCost: spawn.room.energyAvailable,
                fatigue: {
                    max: 4,
                    ignoreCarry: true,
                },
            },
        ),
        name,
        {
            memory: {
                role: 'upgrader',
            },
        },
    );
}

function spawnHarvesterCreep(spawn: StructureSpawn): void {
    const name = `Harvester-${Game.time}`;

    spawn.spawnCreep(
        stripBodyParts(
            [WORK, MOVE, WORK, MOVE, WORK, WORK, WORK, MOVE, CARRY, WORK],
            {
                maxEnergyCost: spawn.room.energyAvailable,
                fatigue: {
                    ignoreCarry: true,
                },
            },
        ),
        name,
        {
        memory: {
            role: 'harvester',
            targetSourceId: getAnySourceIdWithoutHarvester(spawn.room),
        },
    });
}

function spawnBuilderCreep(spawn: StructureSpawn): void {
    const name = `Builder-${Game.time}`;

    spawn.spawnCreep(
        stripBodyParts(
            [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
            {
                maxEnergyCost: spawn.room.energyAvailable,
            },
        ),
        name,
        {
            memory: {
                role: 'builder',
            },
        },
    );
}

function spawnRefillerCreep(spawn: StructureSpawn): void {
    const name = `Refiller-${Game.time}`;

    spawn.spawnCreep(
        stripBodyParts(
            [MOVE, CARRY, MOVE, CARRY, MOVE, WORK, MOVE, CARRY],
            {
                maxEnergyCost: spawn.room.energyAvailable,
            },
        ),
        name, {
        memory: {
            role: 'refiller',
        },
    });
}

function spawnHarvestTransporter(spawn: StructureSpawn): void {
    const name = `HarvestTransporter-${Game.time}`;

    spawn.spawnCreep(
        stripBodyParts(
            [
                CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
                CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
                CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            ],
            {
                maxEnergyCost: spawn.room.energyAvailable,
            },
        ),
        name, {
            memory: {
                role: 'harvest-transporter',
                targetSourceId: getAnySourceIdWithoutTransporter(spawn.room),
            },
        });
}

function doINeedUpgrader(room: Room): boolean {
    return !room
        .find(FIND_MY_CREEPS)
        .find((creep) => creep.memory.role === 'upgrader');
}

function doINeedHarvester(room: Room): boolean {
    return !!getAnySourceIdWithoutHarvester(room);
}

function doINeedHarvestTransporter(room: Room): boolean {
    return !!room.storage && !!getAnySourceIdWithoutTransporter(room);
}

function howManyCreepsDoINeedInRoom(role: string, room: Room): number {
    const neededRolesByRCL: {
        [role: string]: {
            [rcl: number]: number,
        },
    } = {
        builder: {
            1: 1,
            2: 2,
            3: 1,
            4: 1,
            5: 1,

        },
        refiller: {
            1: 2,
            2: 2,
            3: 2,
            4: 2,
            5: 2,
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
    return howManyDoINeed - howManyDoIHave;
}
