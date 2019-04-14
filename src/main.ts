import createExtensionsContructionSites from './constructions/extensions';
import updateHarvestBases from './constructions/harvest-base';
import createStoragesConstructionSites from './constructions/storage';
import createTowersContructionSites from './constructions/towers';
import updateUpgradeBase from './constructions/upgrade-base';
import runBuilderRole from './roles/builder/run-builder-role';
import runDefenderRole from './roles/defender/run-defender-role';
import runHarvesterRole from './roles/harvester/run-harvester-role';
import runHooverRole from './roles/hoover/run-hoover-role';
import runLooterRole from './roles/looter/run-looter-role';
import runRefillerRole from './roles/refiller/run-refiller-role';
import runTransporterRole from './roles/transporter/run-transporter-role';
import runUpgraderRole from './roles/upgrader/run-upgrader-role';
import updateSafeZones from './safe-mode';
import updateSpawner from './spawner/spawner';
import createComboSquad from './squads/combo/create-combo-squad';
import isComboSquadNeeded from './squads/combo/is-combo-squad-needed';
import runComboSquadAttackerRole from './squads/combo/roles/attacker/run-combo-squad-attacker-role';
import runComboSquadMedicRole from './squads/combo/roles/medic/run-combo-squad-medic-role';
import runSquads from './squads/common/run-squads';
import updateDeadSquadCreeps from './squads/common/update-dead-squad-creeps';
import runTower from './tower';
import errorMapper from './utils/error-mapper';
import updateTickRateMeter from './utils/tick-rate-meter';
import {scanAndDrawRoleIcons} from './visuals/draw-creep-role-icon';
import drawSquadsVisual from './visuals/draw-squads';

export const loop = () => {
    errorMapper(tick)();
};

const tick: () => void = () => {
    console.log(`tick ${Game.time}`);
    updateTickRateMeter();

    if (isComboSquadNeeded()) {
        createComboSquad(Game.spawns.Spawn1.room);
    }

    runSquads();
    createExtensionsContructionSites(Game.spawns.Spawn1.room);
    createTowersContructionSites(Game.spawns.Spawn1);
    createStoragesConstructionSites(Game.spawns.Spawn1.room);
    updateSafeZones();
    updateHarvestBases(Game.spawns.Spawn1.room);
    updateUpgradeBase(Game.spawns.Spawn1.room);
    updateSpawner(Game.spawns.Spawn1);
    runRoles();
    runTowers(Game.spawns.Spawn1.room);
    scanAndDrawRoleIcons();
    drawSquadsVisual();

    updateDeadSquadCreeps();
    cleanCreepsMemory();

    // console.log(`cpu: ${Math.ceil(Game.cpu.getUsed() * 100) / 100} / ${Game.cpu.limit} + ${Game.cpu.bucket}`);
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
            case 'hoover':
                runHooverRole(creep);
                break;
            case 'looter':
                runLooterRole(creep);
                break;
            case 'combo-squad-medic':
                runComboSquadMedicRole(creep);
                break;
            case 'combo-squad-attacker':
                runComboSquadAttackerRole(creep);
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
