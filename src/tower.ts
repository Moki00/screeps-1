import drawTowerOptimalRangeVisual from "./visuals/draw-tower-optimal-range";

export default function runTower(tower: StructureTower): void {
  const hasAttacked: boolean = attack(tower) === OK;

  if (!hasAttacked) {
    heal(tower);
  }
}

function attack(tower: StructureTower): ScreepsReturnCode | undefined {
  drawTowerOptimalRangeVisual(tower);

  const hostileCreep: Creep | undefined = findTargetCreep(tower);

  if (!hostileCreep) {
    return;
  }

  const attackReturnCode: ScreepsReturnCode = tower.attack(hostileCreep);

  return attackReturnCode;
}

function findTargetCreep(tower: StructureTower): Creep | undefined {
  return tower.room
    .find(FIND_HOSTILE_CREEPS)
    .filter((hostileCreep) => {
      const isInvader: boolean = hostileCreep.owner.username === "invader";
      if (isInvader) {
        return true;
      }

      const isCloseEnough: boolean = hostileCreep.pos.inRangeTo(
        hostileCreep.pos,
        TOWER_OPTIMAL_RANGE
      );
      return isCloseEnough;
    })
    .find(() => true);
}

function heal(tower: StructureTower): void {
  const areHostileCreepsPresent = !!tower.room.find(FIND_HOSTILE_CREEPS).length;

  const hurtCreep: Creep | undefined = (areHostileCreepsPresent
    ? tower.pos.findInRange(FIND_MY_CREEPS, TOWER_OPTIMAL_RANGE)
    : tower.room.find(FIND_MY_CREEPS)
  ).find((creep) => creep.hits < creep.hitsMax);

  if (hurtCreep) {
    tower.heal(hurtCreep);
  }
}
