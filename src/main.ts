import createExtensionsContructionSites from './constructions/extensions';
import updateHarvestBases from './constructions/harvest-base';
import {
    getMyClaimedRooms,
    getRoomWithMyClosestStorageFromPosition, removeHostileStructuresAndConstructionSites,
    updateFirstSpawnsHelp,
} from './constructions/rooms';
import createStoragesConstructionSites from './constructions/storage';
import updateTerminal from './constructions/terminal';
import createTowersContructionSites from './constructions/towers';
import updateUpgradeBase from './constructions/upgrade-base';
import runBuilderRole from './roles/builder/run-builder-role';
import runDefenderRole from './roles/defender/run-defender-role';
import runHarvesterRole from './roles/harvester/run-harvester-role';
import runHooverRole from './roles/hoover/run-hoover-role';
import runLooterRole from './roles/looter/run-looter-role';
import runRefillerRole from './roles/refiller/run-refiller-role';
import runSettlerRole from './roles/settler/run-settler-role';
import runTransporterRole from './roles/transporter/run-transporter-role';
import runUpgraderRole from './roles/upgrader/run-upgrader-role';
import updateSafeZones from './safe-mode';
import updateSpawner from './spawner/spawner';
import createComboSquad from './squads/combo/create-combo-squad';
import isComboSquadNeeded from './squads/combo/is-combo-squad-needed';
import runComboSquadAttackerRole from './squads/combo/roles/attacker/run-combo-squad-attacker-role';
import runComboSquadMedicRole from './squads/combo/roles/medic/run-combo-squad-medic-role';
import {COMBO_SQUAD_ROOM_TARGET_FLAG_NAME} from './squads/combo/run-combo-squad';
import runSquads from './squads/common/run-squads';
import updateDeadSquadCreeps from './squads/common/update-dead-squad-creeps';
import runTower from './tower';
import errorMapper from './utils/error-mapper';
import Logger from './utils/logger';
import updateTickRateMeter from './utils/tick-rate-meter';
import {updateVisualsToggles} from './visuals/config';
import drawCreepInfo from './visuals/draw-creep-info';
import {scanAndDrawRoleIcons} from './visuals/draw-creep-role-icon';
import drawSquadsVisual from './visuals/draw-squads';

export const loop = () => {
    errorMapper(tick)();
};

const tick: () => void = () => {
    Logger.info(`tick ${Game.time}`);

    updateTickRateMeter();
    updateVisualsToggles();
    updateFirstSpawnsHelp();

    updateComboSquads();

    getMyClaimedRooms().forEach((room) => {
        removeHostileStructuresAndConstructionSites(room);

        const firstSpawn: StructureSpawn | undefined = room.find(FIND_MY_SPAWNS).find(() => true);
        if (!firstSpawn) {
            return;
        }

        createExtensionsContructionSites(room);
        createTowersContructionSites(firstSpawn);
        createStoragesConstructionSites(room);
        updateSafeZones();
        updateHarvestBases(room);
        updateUpgradeBase(room);
        updateSpawner(firstSpawn);
        updateTerminal(room);
        runTowers(room);
    });

    runSquads();
    runRoles();

    scanAndDrawRoleIcons();
    drawSquadsVisual();

    updateDeadSquadCreeps();
    cleanCreepsMemory();

    Logger.info(`cpu: ${Math.ceil(Game.cpu.getUsed() * 100) / 100} / ${Game.cpu.limit} + ${Game.cpu.bucket}`);
};

function runRoles(): void {
    for (const creepName in Game.creeps) {
        const creep: Creep = Game.creeps[creepName];

        if (creep.spawning) {
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
            case 'settler':
                runSettlerRole(creep);
                break;
        }

        drawCreepInfo(creep);
    }
}

function updateComboSquads(): void {
    if (isComboSquadNeeded()) {
        const room: Room | undefined = getRoomWithMyClosestStorageFromPosition(
            Game.flags[COMBO_SQUAD_ROOM_TARGET_FLAG_NAME].pos,
        );
        if (!room) {
            Logger.warning(`Combo squad is needed, but no room to spawn it.`);
            return;
        }

        createComboSquad(room);
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
