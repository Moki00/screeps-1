import {defaultsDeep} from 'lodash';
import BodyPartsCountByType from './body-parts-count-by-type.interface';
import countBodyPartTypes from './count-body-parts-types';
import getBodyPartsCost from './get-body-parts-cost';
import getFatigue from './get-fatigue';

export default function stripBodyParts(
    bodyParts: BodyPartConstant[],
    options?: StripBodyPartsOptions,
): BodyPartConstant[] {
    const options2: StripBodyPartsOptionsWithDefaults = defaultsDeep({}, options, defaultOptions);

    const bodyPartsLeftByType: BodyPartsCountByType = countBodyPartTypes(bodyParts);

    const bodyPartsOutput: BodyPartConstant[] = [...bodyParts];

    bodyParts.forEach((bodyPart, index) => {
        const requiredParts: number = (options2.minBodyParts[bodyPart] || 0);
        const energyCost: number = getBodyPartsCost(bodyPartsOutput);
        const fatigue: number = getFatigue(
            bodyPartsOutput,
            options2.fatigue.surface,
            options2.fatigue.ignoreCarry,
        );
        const minPartsMet: boolean = bodyPartsLeftByType[bodyPart] >= requiredParts;
        if (minPartsMet && bodyPartsLeftByType[bodyPart] >= requiredParts) {
            if (energyCost > options2.maxEnergyCost) {
                bodyPartsOutput.shift();
                bodyPartsLeftByType[bodyPart] -= 1;
            }

            if (
                minPartsMet &&
                fatigue > options2.fatigue.max
            ) {
                bodyPartsOutput.shift();
                bodyPartsLeftByType[bodyPart] -= 1;
            }
        }
    });

    return bodyPartsOutput;
}

interface StripBodyPartsOptions {
    maxEnergyCost?: number;
    fatigue?: {
        max?: number;
        surface?: Surface;
        ignoreCarry?: boolean;
    };
    minBodyParts?: {
        [bodyPart: string]: number;
    };
}

interface StripBodyPartsOptionsWithDefaults {
    maxEnergyCost: number;
    fatigue: {
        max: number;
        surface: Surface;
        ignoreCarry: boolean;
    };
    minBodyParts: {
        [bodyPart: string]: number;
    };
}

const defaultOptions: StripBodyPartsOptions = {
    maxEnergyCost: 99999,
    fatigue: {
        max: 99999,
        surface: 'plain',
        ignoreCarry: false,
    },
    minBodyParts: {},
};
