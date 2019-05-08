import Logger from '../../utils/logger';
import {getCreepPathStyle} from '../../visuals/config';
import BuilderRoleState from './builder-role-state';

export default function build(creep: Creep): void {
    if (!creep.memory.buildTargetObjectId) {
        const constructionSite: ConstructionSite | undefined = findBuildTarget(creep.room);
        creep.memory.buildTargetObjectId = constructionSite ? constructionSite.id : undefined;
    }

    if (!creep.memory.buildTargetObjectId) {
        creep.memory.state = BuilderRoleState.REPAIR;
        return;
    }

    const buildTarget: ConstructionSite | null = Game.getObjectById(creep.memory.buildTargetObjectId);

    if (!buildTarget) {
        Logger.warning(
            `"${creep}" creep's build target doesn't exists. Was it destroyed or completed in the meantime?`);
        creep.memory.buildTargetObjectId = undefined;
        creep.memory.state = BuilderRoleState.REPAIR;
        return;
    }

    const buildReturnCode: ScreepsReturnCode = creep.build(buildTarget);
    switch (buildReturnCode) {
        case ERR_NOT_IN_RANGE:
            creep.moveTo(buildTarget, {
                visualizePathStyle: getCreepPathStyle(creep),
            });
            break;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = BuilderRoleState.FIND_ENERGY;
    }
}

function findBuildTarget(room: Room): ConstructionSite | undefined {
    const anotherRoomFirstSpawnSite: ConstructionSite | undefined = getAnotherRoomFirstSpawnConstructionSite(room);
    if (anotherRoomFirstSpawnSite) {
        return anotherRoomFirstSpawnSite;
    }

    const constructionSites: ConstructionSite[] = room.find(FIND_CONSTRUCTION_SITES)
        .sort((constructionA, constructionB) => {
            const sortByExtensionFirstResult: number = (constructionA.structureType === STRUCTURE_EXTENSION) ? -1 : 1;

            if (sortByExtensionFirstResult !== 0) {
                return sortByExtensionFirstResult;
            }

            const sortByLargestProgressFirst = constructionB.progress - constructionA.progress;
            return sortByLargestProgressFirst;
        });
    return constructionSites.find(() => true);
}

function getAnotherRoomFirstSpawnConstructionSite(room: Room): ConstructionSite | undefined {
    if (room.controller && !room.controller.my) {
        return undefined;
    }
    if (!room.memory.anotherRoomsHelp.firstSpawnPosition) {
        return undefined;
    }

    const anotherRoomFirstSpawnPosition: RoomPosition = new RoomPosition(
        room.memory.anotherRoomsHelp.firstSpawnPosition.x,
        room.memory.anotherRoomsHelp.firstSpawnPosition.y,
        room.memory.anotherRoomsHelp.firstSpawnPosition.room!,
    );
    return anotherRoomFirstSpawnPosition.lookFor(LOOK_CONSTRUCTION_SITES)
        .find((constructionSite) => constructionSite.structureType === STRUCTURE_SPAWN);
}
