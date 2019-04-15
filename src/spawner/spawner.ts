import {getAnySourceIdWithoutHarvester, getAnySourceIdWithoutTransporter} from '../constructions/harvest-base';
import {getRoomEarlyStorageContainer} from '../constructions/storage';
import {doesUpgradeTransporterExists, getUpgraderContainer} from '../constructions/upgrade-base';
import getSumOfResourcesToClean, {ResourcesToClean} from '../roles/hoover/get-sum-of-resourcer-to-clean';
import {isLootFlagSet} from '../roles/looter/run-looter-role';
import getSquadWhichNeedsRole from '../squads/common/get-squad-which-needs-role';
import isRoleNeededByAnySquad from '../squads/common/is-role-needed-by-any-squad';
import stripBodyParts from './helpers/strip-body-parts';

export default function updateSpawner(spawn: StructureSpawn) {
    if (spawn.room.energyAvailable < SPAWN_ENERGY_CAPACITY || spawn.spawning) {
        return;
    }

    if (doINeedLooter(spawn.room)) {
        spawnLooterCreep(spawn);
    }

    if (doINeedHoover(spawn.room)) {
        spawnHooverCreep(spawn);
    }

    if (doINeedBuilder(spawn.room)) {
        spawnBuilderCreep(spawn);
    }

    if (doINeedDefender(spawn.room)) {
        spawnDefenderCreep(spawn);
    }

    if (doINeedUpgrader(spawn.room)) {
        spawnUpgraderCreep(spawn);
    }

    if (isRoleNeededByAnySquad('combo-squad-medic')) {
        spawnComboSquadMedic(spawn);
        return;
    }

    if (isRoleNeededByAnySquad('combo-squad-attacker')) {
        spawnComboSquadAttacker(spawn);
        return;
    }

    if (doINeedTransporter(spawn.room)) {
        spawnTransporter(spawn);
    }

    if (doINeedHarvester(spawn.room)) {
        spawnHarvesterCreep(spawn);
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
            [MOVE, CARRY, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, CARRY, CARRY],
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

function spawnTransporter(spawn: StructureSpawn): void {
    const name = `Transporter-${Game.time}`;

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
                role: 'transporter',
            },
        });
}

function spawnDefenderCreep(spawn: StructureSpawn): void {
    const name = `Defender-${Game.time}`;

    spawn.spawnCreep(
        stripBodyParts(
            [
                ATTACK, ATTACK, MOVE,
                ATTACK, ATTACK, MOVE,
                ATTACK, ATTACK, MOVE,
                ATTACK, ATTACK, MOVE,
                ATTACK, ATTACK, MOVE,
            ],
            {
                maxEnergyCost: spawn.room.energyAvailable,
            },
        ),
        name, {
            memory: {
                role: 'defender',
            },
        });
}

function spawnHooverCreep(spawn: StructureSpawn): void {
    const name = `Hoover-${Game.time}`;

    spawn.spawnCreep(
        stripBodyParts(
            [
                CARRY, CARRY, MOVE,
                CARRY, CARRY, MOVE,
                CARRY, CARRY, MOVE,
                CARRY, CARRY, MOVE,
                CARRY, CARRY, MOVE,
            ],
            {
                maxEnergyCost: spawn.room.energyAvailable,
            },
        ),
        name, {
            memory: {
                role: 'hoover',
            },
        });
}

function spawnLooterCreep(spawn: StructureSpawn): void {
    const name = `Looter-${Game.time}`;

    spawn.spawnCreep(
        stripBodyParts(
            [
                CARRY, MOVE,
                CARRY, MOVE,
                CARRY, MOVE,
                CARRY, MOVE,
                CARRY, MOVE,
                CARRY, MOVE,
                CARRY, MOVE,
                CARRY, MOVE,
                CARRY, MOVE,
                CARRY, MOVE,
            ],
            {
                maxEnergyCost: spawn.room.energyAvailable,
            },
        ),
        name, {
            memory: {
                role: 'looter',
            },
        });
}

function spawnComboSquadMedic(spawn: StructureSpawn): void {
    const role: string = 'combo-squad-medic';
    const name: string = `${role}-${Game.time}`;
    console.log(`spawn ${name}`);

    const assignedSquad: SquadMemory | undefined = getSquadWhichNeedsRole(role);

    if (!assignedSquad) {
        console.log(`Warning: Abort spawning "${name}" creep.`);
        return;
    }

    spawn.spawnCreep(
        [
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL,
        ],
        name,
        {
            memory: {
                role,
                squadName: assignedSquad.name,
            },
        },
    );
}

function spawnComboSquadAttacker(spawn: StructureSpawn): void {
    const role: string = 'combo-squad-attacker';
    const name: string = `${role}-${Game.time}`;
    console.log(`spawn ${name}`);

    const assignedSquad: SquadMemory | undefined = getSquadWhichNeedsRole(role);

    if (!assignedSquad) {
        console.log(`Warning: Abort spawning "${name}" creep.`);
        return;
    }

    spawn.spawnCreep(
        [
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            TOUGH,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            ATTACK, ATTACK, ATTACK,
            MOVE,
        ],
        name,
        {
            memory: {
                role: 'combo-squad-attacker',
                squadName: assignedSquad.name,
            },
        },
    );
}

function doINeedUpgrader(room: Room): boolean {
    const upgradersCount = room
        .find(FIND_MY_CREEPS)
        .filter((creep) => creep.memory.role === 'upgrader')
        .length;

    let upgradersNeeded = 1;

    if (!room.storage) {
        const upgradeContainer: StructureContainer | null = getUpgraderContainer(room);
        if (upgradeContainer && upgradeContainer.store.energy > upgradeContainer.storeCapacity * 0.9) {
            upgradersNeeded = upgradersCount + 1;
        }
    }

    if (room.storage) {
        upgradersNeeded += Math.max(
            0,
            Math.floor((room.storage.store.energy - 100000) / 20000),
        );
    }

    return upgradersCount < upgradersNeeded;
}

function doINeedHarvester(room: Room): boolean {
    return !!getAnySourceIdWithoutHarvester(room);
}

function doINeedTransporter(room: Room): boolean {
    const isThereAnyStorage: boolean = !!room.storage || !!getRoomEarlyStorageContainer(room);
    return (
        isThereAnyStorage &&
        (
            !!getAnySourceIdWithoutTransporter(room) ||
            doesUpgradeTransporterExists(room)
        )
    );
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

function doINeedDefender(room: Room): boolean {
    return !!room.find(FIND_HOSTILE_CREEPS).length;
}

function doINeedHoover(room: Room): boolean {
    const allHooversCarryCapacity: number = room
        .find(FIND_MY_CREEPS)
        .filter((creep) => creep.memory.role === 'hoover')
        .reduce((carryCapacityAccomulator, currentCreep) => {
            return carryCapacityAccomulator + currentCreep.carryCapacity;
        }, 0);

    const resourcesToClean: ResourcesToClean = getSumOfResourcesToClean(room);

    return (
        (
            resourcesToClean.energy > MAX_DROPPED_ENERGY_ALLOWED ||
            resourcesToClean.minerals > MAX_DROPPED_MINERALS_ALLOWED
        ) &&
        (resourcesToClean.all * MIN_HOOVERS_CAPACITY_TO_DROPPED_RESOURCES_RATIO) > allHooversCarryCapacity
    );
}

function doINeedLooter(room: Room): boolean {
    return isLootFlagSet() && room.energyAvailable === room.energyCapacityAvailable;
}

const MIN_HOOVERS_CAPACITY_TO_DROPPED_RESOURCES_RATIO: number = 0.75;
const MAX_DROPPED_ENERGY_ALLOWED: number = 300;
const MAX_DROPPED_MINERALS_ALLOWED: number = 0;
