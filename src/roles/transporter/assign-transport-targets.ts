import {getAnySourceIdWithoutTransporter, getHarvestContainerBySourceId} from '../../constructions/harvest-base';
import {getRoomEarlyStorageContainer} from '../../constructions/storage';
import {getUpgraderContainer} from '../../constructions/upgrade-base';

export default function assignTransportTargets(creep: Creep): void {
    const sourceIdWithoutTransporter: string | null = getAnySourceIdWithoutTransporter(creep.room);
    const storageContainer: StructureStorage | StructureContainer | undefined = getTargetStorage(creep.room);

    if (sourceIdWithoutTransporter) {
        const harvesterContainer: StructureContainer | null =
            getHarvestContainerBySourceId(sourceIdWithoutTransporter);

        if (harvesterContainer && storageContainer) {
            creep.memory.transportFromObjectId = harvesterContainer.id;
            creep.memory.transportToObjectId = storageContainer.id;
            return;
        }
    }

    const upgraderContainer: StructureContainer | null = getUpgraderContainer(creep.room);

    if (upgraderContainer && storageContainer) {
        creep.memory.transportFromObjectId = storageContainer.id;
        creep.memory.transportToObjectId = upgraderContainer.id;
    }
}

function getTargetStorage(room: Room): StructureStorage | StructureContainer | undefined {
    const earlyStorage: StructureContainer | undefined = getRoomEarlyStorageContainer(room);
    const storage: StructureStorage | undefined = room.storage;

    if (earlyStorage && !storage) {
        return earlyStorage;
    }

    return storage;
}
