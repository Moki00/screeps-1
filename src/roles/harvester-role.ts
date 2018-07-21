import {getAnyFreeSourceId, getHarvestingPosition, getSourceOfHarvester} from '../constructions/harvest-base';
import {harvesterPathStyle} from '../visuals';

export default function runHarvesterRole(creep: Creep): void {
    const anyFreeSourceId: string | null = getAnyFreeSourceId(creep.room);

    const source: Source | null = anyFreeSourceId
        ?
        Game.getObjectById(anyFreeSourceId)
        :
        getSourceOfHarvester(creep);

    if (!source) {
        return;
    }

    const harvestingPosition: RoomPosition | null = source.id
        ? getHarvestingPosition(creep.room, source.id) : null;

    if (!harvestingPosition) {
        return;
    }

    creep.moveTo(harvestingPosition, {
        visualizePathStyle: harvesterPathStyle,
    });

    const harvestReturnCode: ScreepsReturnCode = creep.harvest(source);
    switch (harvestReturnCode) {
        case OK: {
            creep.say(`😌⛏⚡`);
            takeCareOfContainerUnder(creep);
            saveDroppedEnergy(creep);
            break;
        }
        case ERR_NOT_IN_RANGE: {
            creep.say(`🙂👉⛏⚡`);
            break;
        }
    }
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
        creep.say('🙂🛠🗑');
        creep.repair(container);
    } else {
        creep.transfer(container, RESOURCE_ENERGY);
    }
}

function buildHarvestersContainerConstructionSite(creep: Creep): void {
    const constructionSite: ConstructionSite | undefined = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES)
        .find((site) => site.structureType === STRUCTURE_CONTAINER) as ConstructionSite | undefined;
    if (!constructionSite) {
        return;
    }

    const creepBuildPower: number = creep.getActiveBodyparts(WORK) * BUILD_POWER;
    if (creep.carry.energy >= creepBuildPower) {
        creep.say('🙂🔨🗑');
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
