import {createExtensionsContructionSites} from './constructions/extensions';
import updateHarvestBases from './constructions/harvest-base';
import RoomControllerMemory from './constructions/room-controller-memory.interface';
import RoomSourcesMemory from './constructions/room-sources-memory.interface';
import updateUpgradeBase from './constructions/upgrade-base';
import runBuilderRole from './roles/builder-role';
import runHarvesterRole from './roles/harvester-role';
import runRefillerRole from './roles/refiller-role';
import runUpgraderRole from './roles/upgrader-role';
import {updateSpawner} from './spawner/spawner';
import errorMapper from './utils/error-mapper';

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
    updateSpawner(Game.spawns.Spawn1);
    runRoles();
    updateHarvestBases(Game.spawns.Spawn1.room);
    updateUpgradeBase(Game.spawns.Spawn1.room);
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
        }
    }
}

function cleanCreepsMemory() {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
}
