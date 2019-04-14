import {getCreepPathStyle} from '../../../../visuals/config';

export default function heal(creep: Creep): void {
    if (!Memory.squads || !creep.memory.squadName) {
        return;
    }

    const squad: SquadMemory = Memory.squads[creep.memory.squadName];

    if (!squad.targetToHealId) {
        return;
    }

    const healTarget: Creep | null = Game.getObjectById<Creep>(squad.targetToHealId);

    if (!healTarget) {
        console.log(`Warning: "${squad.name}" has non existing heal target (id "${squad.targetToHealId}").`);
        return;
    }

    creep.moveTo(healTarget, {
        visualizePathStyle: getCreepPathStyle(creep),
    });
    creep.heal(healTarget);
    creep.rangedHeal(healTarget);
}
