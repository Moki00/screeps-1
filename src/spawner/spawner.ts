import {
    getSourceMemoriesWithLackingHarvesterByOriginRoom,
    getSourceMemoriesWithLackingTransporterByOriginRoom,
} from '../constructions/harvest-base';
import {isRoomMine} from '../constructions/rooms';
import {getRoomEarlyStorageContainer} from '../constructions/storage';
import {doesTerminalNeedTransporter} from '../constructions/terminal';
import {
    doesUpgradersContainerExist,
    doesUpgradeTransporterExist,
    getUpgraderContainer,
} from '../constructions/upgrade-base';
import getSumOfResourcesToClean, {ResourcesToClean} from '../roles/hoover/get-sum-of-resourcer-to-clean';
import {isLootFlagSet} from '../roles/looter/run-looter-role';
import {getRoomsToScout} from '../roles/scout/rooms-to-scout';
import {SETTLER_FLAG_NAME} from '../roles/settler/run-settler-role';
import SETTLER_BODY_PARTS from '../roles/settler/settler-body-parts';
import getSquadWhichNeedsRole from '../squads/common/get-squad-which-needs-role';
import isRoleNeededByAnySquad from '../squads/common/is-role-needed-by-any-squad';
import getHitsToBuild from '../utils/get-hits-to-build';
import getHitsToRepair from '../utils/get-hits-to-repair';
import Logger from '../utils/logger';
import getBodyPartsCost from './helpers/get-body-parts-cost';
import isCreepDangerous from './helpers/is-creep-dangerous';
import stripBodyParts from './helpers/strip-body-parts';

export default function updateSpawner(spawn: StructureSpawn) {
    spawn.room.createConstructionSite(spawn.pos, STRUCTURE_RAMPART);

    if (spawn.room.energyAvailable < SPAWN_ENERGY_CAPACITY || spawn.spawning) {
        return;
    }

    if (doINeedSettler(spawn.room)) {
        spawnSettlerCreep(spawn);
    }

    if (doINeedLooter(spawn.room)) {
        spawnLooterCreep(spawn);
    }

    if (doINeedScout(spawn.room)) {
        spawnScoutCreep(spawn);
    }

    if (doINeedHoover(spawn.room)) {
        spawnHooverCreep(spawn);
    }

    if (doINeedDefender(spawn.room)) {
        spawnDefenderCreep(spawn);
    }

    if (doINeedUpgrader(spawn.room)) {
        spawnUpgraderCreep(spawn);
    }

    if (doINeedBuilder(spawn.room)) {
        spawnBuilderCreep(spawn);
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

function spawnSettlerCreep(spawn: StructureSpawn): void {
    const name = `Settler-${Game.time}`;

    spawn.spawnCreep(
        stripBodyParts(SETTLER_BODY_PARTS),
        name,
        {
            memory: {
                originRoom: spawn.room.name,
                role: 'settler',
            },
        },
    );
}

function spawnUpgraderCreep(spawn: StructureSpawn): void {
    const name = `Upgrader-${Game.time}`;

    spawn.spawnCreep(
        stripBodyParts(
            [
                MOVE, WORK,
                WORK, MOVE,
                WORK, MOVE,
                WORK, MOVE,
                WORK, MOVE,
                CARRY, MOVE,
                WORK, MOVE,
                WORK, MOVE,
                CARRY, MOVE,
                CARRY, MOVE,
                WORK, MOVE,
                CARRY, MOVE,
            ],
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
                originRoom: spawn.room.name,
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
            originRoom: spawn.room.name,
            role: 'harvester',
        },
    });
}

function spawnBuilderCreep(spawn: StructureSpawn): void {
    const name = `Builder-${Game.time}`;

    spawn.spawnCreep(
        stripBodyParts(
            [
                WORK, CARRY, MOVE, MOVE,
                WORK, CARRY, MOVE, MOVE,
                WORK, CARRY, MOVE, MOVE,
                WORK, CARRY, MOVE, MOVE,
                WORK, CARRY, MOVE, MOVE,
                WORK, CARRY, MOVE, MOVE,
                WORK, CARRY, MOVE, MOVE,
                WORK, CARRY, MOVE, MOVE,
                WORK, CARRY, MOVE, MOVE,
                WORK, CARRY, MOVE, MOVE,
            ],
            {
                maxEnergyCost: spawn.room.energyAvailable,
            },
        ),
        name,
        {
            memory: {
                originRoom: spawn.room.name,
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
                originRoom: spawn.room.name,
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
                originRoom: spawn.room.name,
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
                originRoom: spawn.room.name,
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
                originRoom: spawn.room.name,
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
                originRoom: spawn.room.name,
                role: 'looter',
            },
        });
}

function spawnComboSquadMedic(spawn: StructureSpawn): void {
    const role: string = 'combo-squad-medic';
    const name: string = `${role}-${Game.time}`;

    const assignedSquad: SquadMemory | undefined = getSquadWhichNeedsRole(role);

    if (!assignedSquad) {
        Logger.warning(`Abort spawning "${name}" creep.`);
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
                originRoom: spawn.room.name,
                role,
                squadName: assignedSquad.name,
            },
        },
    );
}

function spawnComboSquadAttacker(spawn: StructureSpawn): void {
    const role: string = 'combo-squad-attacker';
    const name: string = `${role}-${Game.time}`;

    const assignedSquad: SquadMemory | undefined = getSquadWhichNeedsRole(role);

    if (!assignedSquad) {
        Logger.warning(`Abort spawning "${name}" creep.`);
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
                originRoom: spawn.room.name,
                role: 'combo-squad-attacker',
                squadName: assignedSquad.name,
            },
        },
    );
}

function spawnScoutCreep(spawn: StructureSpawn): void {
    const name = `Scout-${Game.time}`;

    spawn.spawnCreep([MOVE], name, {
        memory: {
            originRoom: spawn.room.name,
            role: 'scout',
        },
    });
}

function doINeedSettler(room: Room): boolean {
    const settleFlag: Flag | undefined = Game.flags[SETTLER_FLAG_NAME];
    const minimalClaimerSpawnCost: number = getBodyPartsCost(SETTLER_BODY_PARTS);
    const doesSettleExists: boolean = Object.values(Game.creeps).some((creep) => creep.memory.role === 'settler');
    const isRoomAleadyMine: boolean = !!settleFlag && isRoomMine(Game.rooms[settleFlag.pos.roomName]);
    return (
        !!settleFlag &&
        room.energyCapacityAvailable > minimalClaimerSpawnCost &&
        !doesSettleExists &&
        !isRoomAleadyMine
    );
}

function doINeedUpgrader(room: Room): boolean {
    const upgradersCount = room
        .find(FIND_MY_CREEPS)
        .filter((creep) => creep.memory.role === 'upgrader')
        .length;

    let upgradersNeeded = 1;

    if (!room.storage) {
        const upgradeContainer: StructureContainer | undefined = getUpgraderContainer(room);
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
    return getSourceMemoriesWithLackingHarvesterByOriginRoom(room.name).length > 0;
}

function doINeedTransporter(room: Room): boolean {
    const isThereAnyStorage: boolean = !!room.storage || !!getRoomEarlyStorageContainer(room);

    return (
        isThereAnyStorage &&
        (
            getSourceMemoriesWithLackingTransporterByOriginRoom(room.name).length > 0 ||
            (!doesUpgradeTransporterExist(room) && doesUpgradersContainerExist(room)) ||
            !!(room.terminal && doesTerminalNeedTransporter(room.terminal))
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

    const hitsToRepair: number = getHitsToRepair(room);

    let hitsToBuild: number = getHitsToBuild(room);
    if (
        room.memory.anotherRoomsHelp.firstSpawnPosition &&
        room.memory.anotherRoomsHelp.firstSpawnPosition.room &&
        Game.rooms[room.memory.anotherRoomsHelp.firstSpawnPosition.room]
    ) {
        hitsToBuild += getHitsToBuild(Game.rooms[room.memory.anotherRoomsHelp.firstSpawnPosition.room]);
    }

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
    return room.find(FIND_HOSTILE_CREEPS)
        .filter(isCreepDangerous)
        .length > 0;
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

function doINeedScout(room: Room): boolean {
    if (getRoomsToScout(room).length === 0) {
        return false;
    }

    const scoutCount: number = Object.values(Game.creeps)
        .filter((creep) => creep.memory.originRoom === room.name && creep.memory.role === 'scout').length;

    if (scoutCount > 0) {
        return false;
    }

    return true;
}

const MIN_HOOVERS_CAPACITY_TO_DROPPED_RESOURCES_RATIO: number = 0.75;
const MAX_DROPPED_ENERGY_ALLOWED: number = 300;
const MAX_DROPPED_MINERALS_ALLOWED: number = 0;
