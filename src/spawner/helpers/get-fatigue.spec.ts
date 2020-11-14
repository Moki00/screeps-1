import getFatigue from "./get-fatigue";

describe("getFatigue", () => {
  it("should get fatigue", () => {
    expect(getFatigue([MOVE, CARRY, WORK])).toEqual(2);
    expect(getFatigue([MOVE, MOVE, CARRY, WORK])).toEqual(0);
  });

  it("should get fatigue for different surfaces", () => {
    expect(getFatigue([MOVE, CARRY, WORK], "road")).toEqual(0);
    expect(getFatigue([MOVE, CARRY, WORK], "plain")).toEqual(2);
    expect(getFatigue([MOVE, CARRY, WORK], "swamp")).toEqual(8);
  });

  it("should ignore CARRY parts as if they were empty", () => {
    expect(getFatigue([MOVE, CARRY, WORK], "plain", true)).toEqual(0);
  });
});
