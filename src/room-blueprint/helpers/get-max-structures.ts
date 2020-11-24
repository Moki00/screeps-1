const MAX_RCL = 8;

export default function getMaxStructures(
  buildableStructureContant: BuildableStructureConstant
): number {
  return CONTROLLER_STRUCTURES[buildableStructureContant][MAX_RCL];
}
