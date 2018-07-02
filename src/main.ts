import runHarvesterRole from './roles/harvester-role';
import runUpgraderRole from './roles/upgrader-role';
import {updateSpawner} from './spawner';
import errorMapper from './utils/error-mapper';

declare global {
    interface CreepMemory {
        [key: string]: any;
    }
}

declare global {
    interface RoomMemory {
        [key: string]: any;
    }
}

export const loop = () => {
    errorMapper(tick)();
};

const tick: () => void = () => {
    console.log(`tick ${Game.time}`);

    updateSpawner(Game.spawns.Spawn1);
    runRoles();
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
