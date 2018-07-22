import createExtensionsContructionSites from './constructions/extensions';
import updateHarvestBases from './constructions/harvest-base';
import RoomControllerMemory from './constructions/room-controller-memory.interface';
import RoomSourcesMemory from './constructions/room-sources-memory.interface';
import createStorageConstructionSite from './constructions/storage';
import createTowersContructionSites from './constructions/towers';
import updateUpgradeBase from './constructions/upgrade-base';
import runBuilderRole from './roles/builder-role';
import runHarvestTransporterRole from './roles/harvest-transporter-role';
import runHarvesterRole from './roles/harvester-role';
import runRefillerRole from './roles/refiller-role';
import runUpgraderRole from './roles/upgrader-role';
import updateSpawner from './spawner/spawner';
import runTower from './tower';
import errorMapper from './utils/error-mapper';
import {scanAndDrawRoleVisuals} from './visuals/creep-roles';

declare global {
    interface CreepMemory {
        [key: string]: any;
    }
}

declare global {
    interface RoomMemory {
        sources: RoomSourcesMemory;
        controller: RoomControllerMemory;
    }
}

export const loop = () => {
    errorMapper(tick)();
};

const tick: () => void = () => {
    console.log(`tick ${Game.time}`);

    createExtensionsContructionSites(Game.spawns.Spawn1.room);
    createTowersContructionSites(Game.spawns.Spawn1);
    createStorageConstructionSite(Game.spawns.Spawn1.room);
    updateHarvestBases(Game.spawns.Spawn1.room);
    updateUpgradeBase(Game.spawns.Spawn1.room);
    updateSpawner(Game.spawns.Spawn1);
    runRoles();
    runTowers(Game.spawns.Spawn1.room);
    scanAndDrawRoleVisuals();

    cleanCreepsMemory();
};

function runRoles(): void {
    for (const creepName in Game.creeps) {
        const creep: Creep = Game.creeps[creepName];

        switch (creep.memory.role) {
            case 'upgrader':
                runUpgraderRole(creep);
                break;
            case 'harvester':
                runHarvesterRole(creep);
                break;
            case 'builder':
                runBuilderRole(creep);
                break;
            case 'refiller':
                runRefillerRole(creep);
                break;
            case 'harvest-transporter':
                runHarvestTransporterRole(creep);
                break;
        }
    }
}

function runTowers(room: Room): void {
    room.find<StructureTower>(FIND_MY_STRUCTURES)
        .filter((structure) => structure.structureType === STRUCTURE_TOWER)
        .forEach((tower) => {
            runTower(tower);
        });
}

function cleanCreepsMemory() {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
}
