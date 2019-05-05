import {
    getHarvestContainerBySourceId,
    getSourceMemoriesWithLackingTransporterByOriginRoom,
} from '../../constructions/harvest-base';
import SourceMemory from '../../constructions/source-memory.interface';
import {getRoomEarlyStorageContainer} from '../../constructions/storage';
import {doesTerminalNeedTransporter} from '../../constructions/terminal';
import {getTransporterByControllerId, getUpgraderContainer} from '../../constructions/upgrade-base';
import TRANSPORT_NEEDED_RESOURCES_PROGRAM from './transport-needed-resources-program';

export default function assignTransportTargets(creep: Creep): void {
    const sourceMemoryWithLackingTransporter: SourceMemory | undefined =
        getSourceMemoriesWithLackingTransporterByOriginRoom(creep.memory.originRoom).find(() => true);
    const storageContainer: StructureStorage | StructureContainer | undefined = getTargetStorage(creep.room);

    if (sourceMemoryWithLackingTransporter) {
        const harvesterContainer: StructureContainer | null =
            getHarvestContainerBySourceId(sourceMemoryWithLackingTransporter.sourceId);

        if (harvesterContainer && storageContainer) {
            creep.memory.transportFromObjectId = harvesterContainer.id;
            creep.memory.transportToObjectId = storageContainer.id;
            creep.memory.transportResourcesProgram = TRANSPORT_NEEDED_RESOURCES_PROGRAM.ENERGY_ONLY;
            return;
        }
    }

    const upgraderContainer: StructureContainer | null = getUpgraderContainer(creep.room);
    const doesUpgraderTransporterExist: boolean = !!(
        creep.room.controller &&
        !!getTransporterByControllerId(creep.room.controller.id)
    );

    if (upgraderContainer && storageContainer && !doesUpgraderTransporterExist) {
        creep.memory.transportFromObjectId = storageContainer.id;
        creep.memory.transportToObjectId = upgraderContainer.id;
        creep.memory.transportResourcesProgram = TRANSPORT_NEEDED_RESOURCES_PROGRAM.ENERGY_ONLY;
        return;
    }

    const terminal: StructureTerminal | undefined = creep.room.terminal;

    if (creep.room.storage && terminal && doesTerminalNeedTransporter(terminal)) {
        creep.memory.transportFromObjectId = creep.room.storage.id;
        creep.memory.transportToObjectId = terminal.id;
        creep.memory.transportResourcesProgram = TRANSPORT_NEEDED_RESOURCES_PROGRAM.FOR_TERMINAL;
        return;
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
