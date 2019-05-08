import {getRampartHitsToRepair} from '../constructions/rampart';

export default function getHitsToRepair(room: Room): number {
    return room.find(FIND_STRUCTURES)
        .reduce((sumOfHits, structure) => {
            if (!structure.hits || IGNORED_CONSTRUCTION_TYPES.includes(structure.structureType)) {
                return sumOfHits;
            }

            if (structure.structureType === STRUCTURE_RAMPART) {
                const rampartHitsToRepair: number = getRampartHitsToRepair(structure);
                return sumOfHits + rampartHitsToRepair;
            }

            const hitsToRepair: number = structure.hitsMax - structure.hits;

            return sumOfHits + hitsToRepair;

        }, 0);
}

const IGNORED_CONSTRUCTION_TYPES: string[] = [STRUCTURE_WALL];
