export default function isCreepDangerous(creep: Creep): boolean {
    return !!creep.body.find((part) => DANGEROUS_BODY_PARTS.includes(part.type));
}

const DANGEROUS_BODY_PARTS: string[] = [ATTACK, RANGED_ATTACK, HEAL];
