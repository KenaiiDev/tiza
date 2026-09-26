import { describe, expect, it } from "vitest";

import { calculatePercentage } from "./index.js";

describe("calculatePercentage", () => {
  it("returns the earned percentage through the public domain API", () => {
    expect(calculatePercentage({ earnedPoints: 18, possiblePoints: 20 })).toBe(90);
  });

  it("rejects a score without possible points", () => {
    expect(() =>
      calculatePercentage({ earnedPoints: 0, possiblePoints: 0 }),
    ).toThrow("Possible points must be greater than zero");
  });
});
