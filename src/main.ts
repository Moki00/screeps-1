import errorMapper from './utils/error-mapper';

export const loop = () => {
    errorMapper(tick)();
};

const tick: () => void = () => {
    console.log('It works.');
};
