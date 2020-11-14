export default function isCreepCarryingAnything(creep: Creep): boolean {
  return !!Object.values(creep.carry).find(
    (resourceAmount) => resourceAmount > 0
  );
}
