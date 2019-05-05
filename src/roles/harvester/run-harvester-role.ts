import {
    getHarvesterSourceMemory,
    getSourceMemoriesWithLackingHarvesterByOriginRoom,
} from '../../constructions/harvest-base';
import SourceMemory from '../../constructions/source-memory.interface';
import Logger from '../../utils/logger';
import {getCreepPathStyle} from '../../visuals/config';
import recycle from '../common/recycle';

export default function runHarvesterRole(creep: Creep): void {
    if (!creep.memory.targetSourceId) {
        const newSourceMemoryToHarvest: SourceMemory | undefined =
            getSourceMemoriesWithLackingHarvesterByOriginRoom(creep.memory.originRoom).find(() => true);
        if (!newSourceMemoryToHarvest) {
            Logger.warning(`There is no free source to harvest for ${creep}.`);
            recycle(creep);
            return;
        }
        creep.memory.targetSourceId = newSourceMemoryToHarvest.sourceId;
        return;
    }

    const targetSourceMemory: SourceMemory | undefined =
        getHarvesterSourceMemory(creep.memory.targetSourceId, creep.memory.originRoom);
    if (!targetSourceMemory) {
        Logger.error(`Could not find ${creep} source memory.`);
        return;
    }

    const isCreepInTargetRoom: boolean = creep.room.name === targetSourceMemory.harvestingPosition.room;

    const harvestingPosition: RoomPosition = new RoomPosition(
        targetSourceMemory.harvestingPosition.x,
        targetSourceMemory.harvestingPosition.y,
        targetSourceMemory.harvestingPosition.room!,
    );

    if (!harvestingPosition) {
        Logger.error(`${creep} can't find ${harvestingPosition}.`);
        return;
    }

    creep.moveTo(harvestingPosition, {
        reusePath: 25,
        visualizePathStyle: getCreepPathStyle(creep),
    });

    if (isCreepInTargetRoom) {
        const sourceId: string = targetSourceMemory.sourceId;
        const source: Source | null = Game.getObjectById(sourceId);

        if (!source) {
            Logger.warning(`${creep} can't find source.`);
            return;
        }

        const harvestReturnCode: ScreepsReturnCode = creep.harvest(source);
        switch (harvestReturnCode) {
            case OK:
            case ERR_NOT_ENOUGH_RESOURCES: {
                maintainStructures(creep);
                saveDroppedEnergy(creep);
                break;
            }
            case ERR_NOT_IN_RANGE: {
                break;
            }
        }
    }
}

function maintainStructures(creep: Creep): void {
    if (Game.time % 10 === 0) {
        repairHarvestersRampart(creep);
        return;
    }

    takeCareOfContainerUnder(creep);
}

function takeCareOfContainerUnder(creep: Creep): void {
    repairHarvestersContainer(creep);
    buildHarvestersContainerConstructionSite(creep);
}

function repairHarvestersContainer(creep: Creep): void {
    const container: StructureContainer | undefined = creep.pos.lookFor(LOOK_STRUCTURES)
        .find((structure) => structure.structureType === STRUCTURE_CONTAINER) as StructureContainer | undefined;
    if (!container) {
        return;
    }

    const creepRepairPower: number = creep.getActiveBodyparts(WORK) * REPAIR_POWER;
    const constructionHitsTaken: number = container.hitsMax - container.hits;
    if (constructionHitsTaken >= creepRepairPower) {
        creep.repair(container);
    } else {
        creep.transfer(container, RESOURCE_ENERGY);
    }
}

function repairHarvestersRampart(creep: Creep): void {
    const rampart: StructureRampart | undefined = creep.pos.lookFor(LOOK_STRUCTURES)
        .find((structure) => structure.structureType === STRUCTURE_RAMPART) as StructureRampart | undefined;
    if (!rampart) {
        return;
    }

    const desiredHits: number = rampart.hitsMax / 100;
    if (rampart.hits < desiredHits) {
        creep.repair(rampart);
    }
}

function buildHarvestersContainerConstructionSite(creep: Creep): void {
    const constructionSite: ConstructionSite | undefined = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES)
        .find(isContainerOrRampartConstructionSite) as ConstructionSite | undefined;
    if (!constructionSite) {
        return;
    }

    const creepBuildPower: number = creep.getActiveBodyparts(WORK) * BUILD_POWER;
    if (creep.carry.energy >= creepBuildPower) {
        creep.build(constructionSite);
    }
}

function saveDroppedEnergy(creep: Creep) {
    const energyResource: Resource | undefined = creep.pos.lookFor(LOOK_RESOURCES)
        .find((resource) => resource.resourceType === RESOURCE_ENERGY) as Resource | undefined;
    if (!energyResource) {
        return;
    }

    creep.pickup(energyResource);
}

function isContainerOrRampartConstructionSite(site: ConstructionSite): boolean {
    const structures: StructureConstant[] = [STRUCTURE_CONTAINER, STRUCTURE_RAMPART];
    return structures.includes(site.structureType);
}
