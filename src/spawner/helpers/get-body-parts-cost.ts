export default function getBodyPartsCost(
  bodyParts: BodyPartConstant[]
): number {
  let cost = 0;
  bodyParts.forEach((bodyPart) => {
    cost += BODYPART_COST[bodyPart];
  });

  return cost;
}
