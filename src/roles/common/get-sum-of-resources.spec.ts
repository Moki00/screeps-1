import getSumOfResources from './get-sum-of-resources';

describe('getSumOfResources', () => {
    it('should sum creep carry storage', () => {
        const creepMock: Creep = {
            carry: {
                [RESOURCE_ENERGY]: 100,
                [RESOURCE_OXYGEN]: 10,
                [RESOURCE_POWER]: 1,
            },
        } as Creep;

        expect(getSumOfResources(creepMock)).toEqual(111);
    });

    it('should sum structure storage', () => {
        const structureMock: StructureStorage = {
            store: {
                [RESOURCE_ENERGY]: 100,
                [RESOURCE_OXYGEN]: 10,
                [RESOURCE_POWER]: 1,
            },
        } as StructureStorage;

        expect(getSumOfResources(structureMock)).toEqual(111);
    });

    it('should not break when given incorrect argument (TODO: type it correctly)', () => {
        const somethingWithoutStorage = {};
        expect(getSumOfResources(somethingWithoutStorage)).toEqual(0);
    });
});
