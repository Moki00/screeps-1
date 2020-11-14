import { hasTerminalTooLittleEnergy } from "../../constructions/terminal";
import AnyStorableStructure from "../../utils/any-storable-structure.type";
import isCreepCarryingAnything from "../../utils/is-creep-carrying-anything";
import Logger from "../../utils/logger";
import { getCreepPathStyle } from "../../visuals/config";
import recycle from "../common/recycle";
import TRANSPORT_NEEDED_RESOURCES_PROGRAM from "./transport-needed-resources-program";
import TransporterState from "./transporter-state";

export default function transportFrom(creep: Creep): void {
  const transportTarget: AnyStorableStructure | null = getTransporterTargetObject(
    creep
  );
  if (!transportTarget) {
    Logger.warning(
      `No transport (from) target for transporter '${creep.name}'.`
    );
    recycle(creep);
    return;
  }

  const withdrawResource: ResourceConstant | null = getNextWithdrawResource(
    creep
  );
  if (!withdrawResource && !isCreepCarryingAnything(creep)) {
    Logger.warning(`Creep ${creep.name} has nothing more to transport.`);
    recycle(creep);
    return;
  }

  if (!withdrawResource) {
    creep.memory.state = TransporterState.TRANSPORT_TO;
    return;
  }

  const withdrawReturnCode: ScreepsReturnCode = creep.withdraw(
    transportTarget,
    withdrawResource
  );
  switch (withdrawReturnCode) {
    case OK:
    case ERR_NOT_ENOUGH_RESOURCES:
    case ERR_FULL:
      creep.memory.state = TransporterState.TRANSPORT_TO;
      break;
    case ERR_NOT_IN_RANGE: {
      creep.moveTo(transportTarget, {
        visualizePathStyle: getCreepPathStyle(creep),
      });
      break;
    }
  }
}

function getTransporterTargetObject(creep: Creep): AnyStorableStructure | null {
  if (!creep.memory.transportFromObjectId) {
    return null;
  }

  return Game.getObjectById(creep.memory.transportFromObjectId);
}

function getNextWithdrawResource(
  transporterCreep: Creep
): ResourceConstant | null {
  const transportResourcesProgram: string | undefined =
    transporterCreep.memory.transportResourcesProgram;

  switch (transportResourcesProgram) {
    case TRANSPORT_NEEDED_RESOURCES_PROGRAM.ENERGY_ONLY:
      return RESOURCE_ENERGY;
    case TRANSPORT_NEEDED_RESOURCES_PROGRAM.FOR_TERMINAL:
      return forTerminal(transporterCreep);
    default:
      Logger.warning(
        `Creep ${transporterCreep.name} has no transportResourcesProgram!`
      );
      return RESOURCE_ENERGY;
  }
}

function forTerminal(transporterCreep: Creep): ResourceConstant | null {
  const storage: StructureStorage | undefined = transporterCreep.room.storage;
  const terminal: StructureTerminal | undefined =
    transporterCreep.room.terminal;

  if (!storage || !terminal) {
    Logger.warning(
      `Room ${transporterCreep.room.name} ` +
        `needs to have storage and terminal for terminal transporter.`
    );
    return null;
  }

  const anyMineral: ResourceConstant | undefined = Object.keys(
    storage.store
  ).find((resource) => resource !== RESOURCE_ENERGY) as ResourceConstant;

  if (anyMineral) {
    return anyMineral;
  }

  if (hasTerminalTooLittleEnergy(terminal)) {
    return RESOURCE_ENERGY;
  }

  return null;
}
