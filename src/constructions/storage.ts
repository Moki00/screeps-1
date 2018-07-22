import {first} from 'lodash';

export default function createStorageConstructionSite(room: Room): void {
    const spawn: StructureSpawn | undefined = first(room.find(FIND_MY_SPAWNS));

    if (!spawn) {
        return;
    }

    room.createConstructionSite(
        spawn.pos.x,
        spawn.pos.y + 1,
        STRUCTURE_STORAGE,
    );
}
