export interface Score {
  earnedPoints: number;
  possiblePoints: number;
}

export function calculatePercentage(score: Score): number {
  if (score.possiblePoints <= 0) {
    throw new RangeError("Possible points must be greater than zero");
  }

  return (score.earnedPoints / score.possiblePoints) * 100;
}
