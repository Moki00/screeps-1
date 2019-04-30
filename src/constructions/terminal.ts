import TRANSPORT_RESOURCES_PROGRAM from '../roles/transporter/transport-needed-resources-program';

export default function updateTerminal(room: Room): void {
    createTerminalConstructionSite(room);
}

export function createTerminalConstructionSite(room: Room): void {
    if (!room.storage) {
        // TODO: get rid of storage position dependency
        return;
    }

    const terminalPosition: RoomPosition = new RoomPosition(
        room.storage.pos.x,
        room.storage.pos.y + 2,
        room.name,
    );

    room.createConstructionSite(terminalPosition, STRUCTURE_TERMINAL);
}

export function doesTerminalNeedTransporter(terminal: StructureTerminal): boolean {
    if (!terminal.room.storage) {
        return false;
    }

    return (
        (
            hasTerminalTooLittleEnergy(terminal) ||
            hasStorageAnythingThatIsNotEnergy(terminal.room.storage)
        ) &&
        !doesTerminalTransporterExist(terminal)
    );
}

function doesTerminalTransporterExist(terminal: StructureTerminal): boolean {
    return !!terminal.room.find(FIND_MY_CREEPS)
        .find((creep) => {
            return creep.memory.transportResourcesProgram === TRANSPORT_RESOURCES_PROGRAM.FOR_TERMINAL;
        });
}

export function hasStorageAnythingThatIsNotEnergy(storage: StructureStorage): boolean {
    return Object.keys(storage.store).length > 1;
}

export function hasTerminalTooLittleEnergy(terminal: StructureTerminal): boolean {
    return terminal.store.energy < TERMINAL_MIN_ENERGY_AMOUNT;
}

export const TERMINAL_MIN_ENERGY_AMOUNT: number = 20000;
