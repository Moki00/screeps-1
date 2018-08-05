import {sum} from 'lodash';

export default function getSumOfResources(somethingWithStorage: any): number {
    const storage = somethingWithStorage.carry ? somethingWithStorage.carry : somethingWithStorage.store;
    if (!storage) {
        console.log('Warning: Object has no storage.'); // TODO: type this function correctly if possible
        return 0;
    }
    return sum(Object.values(storage));
}
