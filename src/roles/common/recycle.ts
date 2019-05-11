import {getRoomEarlyStorageContainer} from '../../constructions/storage';
import Logger from '../../utils/logger';
import {getCreepPathStyle} from '../../visuals/config';

export default function recycle(creep: Creep): void {
    const spawn: StructureSpawn | undefined = creep.room
        .find(FIND_MY_STRUCTURES)
        .find((structure) => structure.structureType === STRUCTURE_SPAWN) as StructureSpawn | undefined;

    if (!spawn) {
        Logger.warning(`${creep} can't be recycled, so it will be suicided.`);
        creep.suicide();
        return;
    }

    const recycleContainer: StructureContainer | undefined = getRoomEarlyStorageContainer(creep.room);

    const moveTarget: StructureSpawn | StructureContainer = recycleContainer ? recycleContainer : spawn;

    if (!recycleContainer) {
        creep.suicide();
        return;
    }

    creep.moveTo(recycleContainer, {
        visualizePathStyle: getCreepPathStyle(creep),
    });

    if (creep.pos.isEqualTo(moveTarget) && creep.pos.isNearTo(spawn)) {
        spawn.recycleCreep(creep);
    }
}
