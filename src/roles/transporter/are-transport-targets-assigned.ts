export default function areTransportTargetsAssigned(creep: Creep): boolean {
    return !!(creep.memory.transportFromObjectId && creep.memory.transportToObjectId);
}
