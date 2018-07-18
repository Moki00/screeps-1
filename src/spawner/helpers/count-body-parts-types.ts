import BodyPartsCountByType from './body-parts-count-by-type.interface';

export default function countBodyPartTypes(bodyParts: BodyPartConstant[]): BodyPartsCountByType {
    const output: BodyPartsCountByType = {};
    Object.keys(BODYPART_COST).forEach((bodyPartType) => {
        output[bodyPartType] = 0;
    });

    bodyParts.forEach((bodyPart) => {
        output[bodyPart] += 1;
    });

    return output;
}
