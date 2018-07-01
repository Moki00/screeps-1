import runUpgraderRole from './roles/upgrader-role';
import {spawnCreep} from './spawner';
import errorMapper from './utils/error-mapper';

declare global {
    interface CreepMemory {
        [key: string]: any;
    }
}

export const loop = () => {
    errorMapper(tick)();
};

const tick: () => void = () => {
    console.log(`tick ${Game.time}`);

    spawnCreep(Game.spawns.Spawn1);

    for (const creepName in Game.creeps) {
        const creep: Creep = Game.creeps[creepName];

        if (creep.memory.role === 'upgrader') {
            runUpgraderRole(creep);
        }
    }

    cleanCreepsMemory();
};

function cleanCreepsMemory() {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
}
