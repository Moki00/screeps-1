export default function getBodyPartsCost(bodyParts: BodyPartConstant[]): number {
    let cost: number = 0;
    bodyParts.forEach((bodyPart) => {
        cost += BODYPART_COST[bodyPart];
    });

    return cost;
}
