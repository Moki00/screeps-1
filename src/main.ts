import createExtensionsContructionSites from './constructions/extensions';
import updateHarvestBases from './constructions/harvest-base';
import createStorageConstructionSite from './constructions/storage';
import createTowersContructionSites from './constructions/towers';
import updateUpgradeBase from './constructions/upgrade-base';
import runBuilderRole from './roles/builder/run-builder-role';
import runDefenderRole from './roles/defender/run-defender-role';
import runHarvesterRole from './roles/harvester/run-harvester-role';
import runRefillerRole from './roles/refiller/run-refiller-role';
import runTransporterRole from './roles/transporter/run-transporter-role';
import runUpgraderRole from './roles/upgrader/run-upgrader-role';
import updateSafeZones from './safe-mode';
import updateSpawner from './spawner/spawner';
import runTower from './tower';
import errorMapper from './utils/error-mapper';
import updateTickRateMeter from './utils/tick-rate-meter';
import {scanAndDrawRoleIcons} from './visuals/draw-creep-role-icon';

export const loop = () => {
    errorMapper(tick)();
};

const tick: () => void = () => {
    console.log(`tick ${Game.time}`);
    updateTickRateMeter();
    createExtensionsContructionSites(Game.spawns.Spawn1.room);
    createTowersContructionSites(Game.spawns.Spawn1);
    createStorageConstructionSite(Game.spawns.Spawn1.room);
    updateSafeZones();
    updateHarvestBases(Game.spawns.Spawn1.room);
    updateUpgradeBase(Game.spawns.Spawn1.room);
    updateSpawner(Game.spawns.Spawn1);
    runRoles();
    runTowers(Game.spawns.Spawn1.room);
    scanAndDrawRoleIcons();

    cleanCreepsMemory();
};

function runRoles(): void {
    for (const creepName in Game.creeps) {
        const creep: Creep = Game.creeps[creepName];

        if (!creep.id) {
            break;
        }

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
            case 'transporter':
                runTransporterRole(creep);
                break;
            case 'defender':
                runDefenderRole(creep);
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
