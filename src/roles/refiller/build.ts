import {getCreepPathStyle} from '../../visuals/config';
import RefillerRoleState from './refiller-role-state';

export default function build(creep: Creep): void {
    const constructionSites: ConstructionSite[] = creep.room.find(FIND_CONSTRUCTION_SITES);

    if (constructionSites.length) {
        const buildReturnCode: ScreepsReturnCode = creep.build(constructionSites[0]);

        switch (buildReturnCode) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(constructionSites[0], {
                    visualizePathStyle: getCreepPathStyle(creep),
                });
                break;
        }
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = RefillerRoleState.FIND_ENERGY;
    } else {
        creep.memory.state = RefillerRoleState.REFILL;
    }
}
