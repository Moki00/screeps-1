import Logger from '../../utils/logger';
import {getCreepPathStyle} from '../../visuals/config';
import recycle from '../common/recycle';

export default function runSettlerRole(creep: Creep): void {
    const settleFlag: Flag | undefined = Game.flags[SETTLER_FLAG_NAME];

    if (!settleFlag) {
        Logger.warning(`There is no "${SETTLER_FLAG_NAME}" flag for "${creep.name}" creep to follow.`);
        recycle(creep);
        return;
    }

    const roomToClaim: Room | undefined = settleFlag.room;
    const isCreepInTargetRoom: boolean = creep.room.name === settleFlag.pos.roomName;
    if (!isCreepInTargetRoom || !roomToClaim) {
        creep.moveTo(settleFlag, {
            visualizePathStyle: getCreepPathStyle(creep),
        });

        return;
    }

    const controllerToClaim: StructureController | undefined = roomToClaim.controller;

    if (!controllerToClaim) {
        Logger.error(`Room "${roomToClaim.name}" doesn't have controller, therefore can't be claimed.`);
        recycle(creep);
        return;
    }

    creep.moveTo(controllerToClaim, {
        visualizePathStyle: getCreepPathStyle(creep),
    });

    const claimReturnCode: ScreepsReturnCode = creep.claimController(controllerToClaim);
    switch (claimReturnCode) {
        case OK:
            removeAllConstructionSites(roomToClaim);
            break;
        case ERR_NOT_IN_RANGE:
            creep.moveTo(controllerToClaim, {
                visualizePathStyle: getCreepPathStyle(creep),
            });
            break;
        case ERR_INVALID_TARGET:
            Logger.warning(`The room cannot be claimed, because it's not neutral.`);
            break;
        case ERR_NO_BODYPART:
            Logger.warning(`Creep "${creep.name}" doesn't have claim parts to claim "${roomToClaim.name}" controller`);
            break;
    }

    const createSpawnReturnCode: ScreepsReturnCode = roomToClaim.createConstructionSite(
        settleFlag.pos.x,
        settleFlag.pos.y,
        STRUCTURE_SPAWN,
        `Spawn-${roomToClaim.name}-${settleFlag.pos.x}-${settleFlag.pos.y}`,
    );

    if (createSpawnReturnCode === OK) {
        Game.flags[SETTLER_FLAG_NAME].remove();
    }
}

function removeAllConstructionSites(room: Room): void {
    room.find(FIND_CONSTRUCTION_SITES)
        .forEach((constructionSite) => constructionSite.remove());
}

export const SETTLER_FLAG_NAME: string = 'settle';
