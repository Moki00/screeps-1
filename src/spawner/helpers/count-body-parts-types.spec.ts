import BodyPartsCountByType from './body-parts-count-by-type.interface';
import countBodyPartTypes from './count-body-parts-types';

describe('countBodyPartTypes', () => {
    it('should count number of each body part type', () => {
        const countedBodyParts: BodyPartsCountByType = countBodyPartTypes([MOVE, CARRY, MOVE]);
        expect(countedBodyParts[MOVE]).toEqual(2);
        expect(countedBodyParts[CARRY]).toEqual(1);
        expect(countedBodyParts[WORK]).toEqual(0);
    });

    it(`should return 0 for parts that don't occur`, () => {
        const countedBodyParts: BodyPartsCountByType = countBodyPartTypes([MOVE, CARRY, MOVE]);
        expect(countedBodyParts[WORK]).toEqual(0);
    });
});