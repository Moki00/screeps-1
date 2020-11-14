import Dimensions2D from "../../constructions/dimensions.interface";
import { getRecruitmentAreaDimensions } from "./find-recruiting-area";

describe.each([
  [2, { x: 2, y: 1 }],
  [3, { x: 2, y: 2 }],
  [6, { x: 3, y: 2 }],
  [7, { x: 3, y: 3 }],
  [20, { x: 5, y: 4 }],
  [21, { x: 5, y: 5 }],
])(
  "getRecruitmentAreaDimensions(%i)",
  (seatsNumber: number, expectedDimension: Dimensions2D) => {
    it(`should return dimensions of most square as possible area`, () => {
      const areaDimensions: Dimensions2D = getRecruitmentAreaDimensions(
        seatsNumber
      );
      expect(areaDimensions).toEqual(expectedDimension);
    });
  }
);
