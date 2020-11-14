import ComboSquadState from "./combo-squad-state";
import ComboSquadAttackerState from "./roles/attacker/combo-squad-attacker-state";
import ComboSquadMedicState from "./roles/medic/combo-squad-medic-state";

export default function runComboSquad(squad: SquadMemory): void {
  if (!Game.flags[COMBO_SQUAD_ROOM_TARGET_FLAG_NAME]) {
    return;
  }

  switch (squad.state) {
    case ComboSquadState.RECRUIT:
      break;
    case ComboSquadState.FIGHT:
      fight(squad);
      break;
  }
}

function fight(squad: SquadMemory): void {
  const room: Room | undefined =
    Game.flags[COMBO_SQUAD_ROOM_TARGET_FLAG_NAME].room;
  if (room) {
    const killTarget: Creep | undefined = pickKillTarget(room);
    squad.targetToKillId = killTarget ? killTarget.id : undefined;
  }

  const healTarget: Creep | undefined = pickHealTarget(squad);
  squad.targetToHealId = healTarget ? healTarget.id : undefined;

  const squadCreeps: Creep[] = getSquadCreeps(squad);
  squadCreeps.forEach((creep) => {
    switch (creep.memory.role) {
      case "combo-squad-medic":
        creep.memory.state = ComboSquadMedicState.HEAL;
        break;
      case "combo-squad-attacker":
        creep.memory.state = ComboSquadAttackerState.FIGHT;
        break;
    }
  });
}

function getSquadCreeps(squad: SquadMemory): Creep[] {
  return squad.seats
    .filter((seat) => seat.assignedCreepId)
    .map((seat) => Game.getObjectById<Creep>(seat.assignedCreepId as Id<Creep>))
    .filter((creep) => creep !== null) as Creep[];
}

function pickKillTarget(room: Room): Creep | undefined {
  const enemies: Creep[] = room
    .find(FIND_HOSTILE_CREEPS)
    .sort(
      (creepA, creepB) => countAttackParts(creepA) - countAttackParts(creepB)
    );

  if (!enemies.length) {
    return;
  }

  return enemies[0];
}

function countAttackParts(creep: Creep): number {
  const attackBodyParts: BodyPartConstant[] = [ATTACK, RANGED_ATTACK];
  return creep.body.reduce((attackPartsSum, currentCreep) => {
    return attackBodyParts.includes(currentCreep.type)
      ? attackPartsSum + 1
      : attackPartsSum;
  }, 0);
}

function pickHealTarget(squad: SquadMemory): Creep | undefined {
  const creeps: Creep[] = getSquadCreeps(squad).sort((creep) => {
    return creep.memory.role ? 1 : -1;
  });
  return getMostInjuredCreep(creeps);
}

function getMostInjuredCreep(creeps: Creep[]): Creep | undefined {
  creeps.sort(
    (creepA, creepB) =>
      getPercentageOfHits(creepA) - getPercentageOfHits(creepB)
  );
  if (!creeps.length) {
    return undefined;
  }

  return creeps[0];
}

function getPercentageOfHits(creep: Creep): number {
  return creep.hits / creep.hitsMax;
}

export const COMBO_SQUAD_ROOM_TARGET_FLAG_NAME = "combo-squad-attack";
