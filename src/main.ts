import errorMapper from './utils/error-mapper';

export const loop = () => {
    errorMapper(tick)();
};

const tick: () => void = () => {
    console.log(`tick ${Game.time}`);

    cleanCreepsMemory();
};

function cleanCreepsMemory() {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
}