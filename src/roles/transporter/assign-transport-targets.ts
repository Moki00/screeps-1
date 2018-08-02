import {getAnySourceIdWithoutTransporter, getHarvestContainerBySourceId} from '../../constructions/harvest-base';
import {getUpgraderContainer} from '../../constructions/upgrade-base';

export default function assignTransportTargets(creep: Creep): void {
    const sourceIdWithoutTransporter: string | null = getAnySourceIdWithoutTransporter(creep.room);
    if (sourceIdWithoutTransporter) {
        const harvesterContainer: StructureContainer | null =
            getHarvestContainerBySourceId(sourceIdWithoutTransporter);

        if (harvesterContainer) {
            creep.memory.transportFromObjectId = harvesterContainer.id;
            creep.memory.transportToObjectId = creep.room.storage!.id;
            // TODO: add container to be used as substitute to storage target in early RCL
            return;
        }
    }

    const upgraderContainer: StructureContainer | null = getUpgraderContainer(creep.room);

    if (upgraderContainer) {
        creep.memory.transportFromObjectId = creep.room.storage!.id;
        creep.memory.transportToObjectId = upgraderContainer.id;
    }
}
