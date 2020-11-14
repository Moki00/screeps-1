import stripBodyParts from "./strip-body-parts";

describe("stripBodyParts", () => {
  describe("maxEnergyCost option", () => {
    it("should strip body parts to max energy", () => {
      expect(
        stripBodyParts(
          [
            MOVE,
            WORK,
            MOVE,
            WORK,
            MOVE,
            WORK,
            MOVE,
            WORK,
            MOVE,
            MOVE,
            WORK,
            CARRY,
          ],
          {
            maxEnergyCost: 300,
          }
        )
      ).toEqual([MOVE, MOVE, WORK, CARRY]);
    });

    it("should strip nothing when full body is already within max cost", () => {
      expect(
        stripBodyParts([CARRY, MOVE, WORK], {
          maxEnergyCost: 300,
        })
      ).toEqual([CARRY, MOVE, WORK]);
    });
  });

  describe("maxFatigue option", () => {
    it("should strip body parts to maintain max fatigue", () => {
      expect(
        stripBodyParts([TOUGH, TOUGH, MOVE, WORK, MOVE, CARRY], {
          fatigue: {
            max: 0,
          },
        })
      ).toEqual([MOVE, WORK, MOVE, CARRY]);
    });

    it("should be able to ignore CARRY parts (as if they were empty)", () => {
      expect(
        stripBodyParts([TOUGH, WORK, MOVE, WORK, MOVE, CARRY], {
          fatigue: {
            max: 0,
            ignoreCarry: true,
          },
        })
      ).toEqual([WORK, MOVE, WORK, MOVE, CARRY]);
    });

    it("should be able to maintain max fatigue for specified surface", () => {
      expect(
        stripBodyParts([TOUGH, TOUGH, CARRY, CARRY, MOVE, WORK, MOVE, CARRY], {
          fatigue: {
            max: 0,
            surface: "road",
            ignoreCarry: false,
          },
        })
      ).toEqual([CARRY, CARRY, MOVE, WORK, MOVE, CARRY]);

      expect(
        stripBodyParts(
          [TOUGH, CARRY, TOUGH, TOUGH, MOVE, CARRY, MOVE, MOVE, MOVE, CARRY],
          {
            fatigue: {
              max: 2,
              surface: "swamp",
              ignoreCarry: false,
            },
          }
        )
      ).toEqual([MOVE, CARRY, MOVE, MOVE, MOVE, CARRY]);

      expect(
        stripBodyParts(
          [TOUGH, CARRY, TOUGH, TOUGH, MOVE, CARRY, MOVE, MOVE, MOVE, CARRY],
          {
            fatigue: {
              max: 0,
              surface: "swamp",
              ignoreCarry: false,
            },
          }
        )
      ).toEqual([MOVE, MOVE, MOVE, CARRY]);
    });
  });
});
