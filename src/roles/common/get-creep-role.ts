export default function getCreepRole(creep: Creep): string {
  return creep.memory.role || "unknown";
}
