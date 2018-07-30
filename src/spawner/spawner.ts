import {getAnySourceIdWithoutHarvester, getAnySourceIdWithoutTransporter} from '../constructions/harvest-base';
import stripBodyParts from './helpers/strip-body-parts';

export default function updateSpawner(spawn: StructureSpawn) {
    if (spawn.room.energyAvailable < SPAWN_ENERGY_CAPACITY) {
        return;
    }

    if (doINeedHarvestTransporter(spawn.room)) {
        spawnHarvestTransporter(spawn);
    }

    if (doINeedBuilder(spawn.room)) {
        spawnBuilderCreep(spawn);
    }

    if (doINeedHarvester(spawn.room)) {
        spawnHarvesterCreep(spawn);
    }

    if (doINeedUpgrader(spawn.room)) {
        spawnUpgraderCreep(spawn);
    }

    if (doINeedRefiller(spawn.room)) {
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
    return room
        .find(FIND_MY_CREEPS)
        .filter((creep) => creep.memory.role === 'upgrader')
        .length < 2;
}

function doINeedHarvester(room: Room): boolean {
    return !!getAnySourceIdWithoutHarvester(room);
}

function doINeedHarvestTransporter(room: Room): boolean {
    return !!room.storage && !!getAnySourceIdWithoutTransporter(room);
}

function doINeedBuilder(room: Room): boolean {
    const builders: Creep[] = room.find(FIND_MY_CREEPS)
        .filter((creep) => creep.memory.role === 'builder');

    const buildersWorkParts: number = builders
        .map((creep) => creep.getActiveBodyparts(WORK))
        .reduce((accomulator, currentValue) => accomulator + currentValue, 0);

    const buildersTicksToLive: number = builders
        .map((creep) => creep.ticksToLive!)
        .reduce((accomulator, currentValue) => accomulator + currentValue, 0);

    const hitsToRepair: number = room.find(FIND_STRUCTURES)
        .filter((structure) => {
            if (structure.hits === undefined) {
                return false;
            }

            const ignoredConstructionTypes: string[] = [STRUCTURE_RAMPART, STRUCTURE_WALL];
            return !ignoredConstructionTypes
                .find((structureType) => structureType === structure.structureType);
        })
        .map((structure) => {

            return structure.hitsMax - structure.hits;
        })
        .reduce((accomulator, currentValue) => accomulator + currentValue, 0);

    const hitsToBuild: number = room.find(FIND_MY_CONSTRUCTION_SITES)
        .map((constructionSite) => constructionSite.progressTotal - constructionSite.progress)
        .reduce((accomulator, currentValue) => accomulator + currentValue, 0);

    const ticksToRepair: number = Math.ceil(hitsToRepair / REPAIR_POWER);
    const ticksToBuild: number = Math.ceil(hitsToBuild / BUILD_POWER);
    const ticksToWork: number = ticksToRepair + ticksToBuild;

    const workWorthLeftQuickAssumption: number = buildersWorkParts * (buildersTicksToLive / 2);

    return ticksToWork > workWorthLeftQuickAssumption;
}

function doINeedRefiller(room: Room): boolean {
    return room
        .find(FIND_MY_CREEPS)
        .filter((creep) => creep.memory.role === 'refiller')
        .length < 2;
}
