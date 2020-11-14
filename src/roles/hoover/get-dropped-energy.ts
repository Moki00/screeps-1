export default function getDroppedResource(creep: Creep): Resource | undefined {
  const droppedResource: Resource | undefined = creep.room
    .find(FIND_DROPPED_RESOURCES)
    .find(() => true);

  return droppedResource;
}
