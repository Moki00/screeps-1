export default function getFatigue(
    bodyParts: BodyPartConstant[],
    surfaceType: Surface = 'plain',
    ignoreCarry: boolean = false,
): number {
    let fatigue: number = 0;

    bodyParts.forEach((bodyPart) => {
        if (bodyPart === MOVE) {
            fatigue -= MOVEMENT_DECREASE;
        } else if (ignoreCarry && bodyPart === CARRY) {
            fatigue += 0;
        } else {
            fatigue += MOVEMENT_COST[surfaceType];
        }
    });

    return fatigue;
}

const MOVEMENT_COST = {
    road: 1,
    plain: 2,
    swamp: 5,
};

const MOVEMENT_DECREASE = 2;
