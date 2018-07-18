import getBodyPartsCost from './get-body-parts-cost';

describe('getBodyPartsCost', () => {
    it('should sum up energy cost', () => {
        expect(getBodyPartsCost([TOUGH, MOVE, WORK, CARRY, MOVE])).toEqual(260);
    });
});
