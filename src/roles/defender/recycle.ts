import {getCreepPathStyle} from '../../visuals/config';

export default function recycle(creep: Creep): void {
    const spawn: StructureSpawn | undefined = creep.room
        .find(FIND_MY_STRUCTURES)
        .find((structure) => structure.structureType === STRUCTURE_SPAWN) as StructureSpawn | undefined;

    if (!spawn) {
        creep.suicide();
        return;
    }

    creep.moveTo(spawn, {
        visualizePathStyle: getCreepPathStyle(creep),
    });

    if (creep.pos.isNearTo(spawn)) {
        spawn.recycleCreep(creep);
    }
}
