export const LESSON_POINTS = 10;
export const CHALLENGE_POINTS = 20;
export const UNIT_POINTS = 50;

export type RewardBucket = "awardedLessons" | "awardedChallenges" | "awardedUnits";

export type RewardState = {
  points: number;
  awardedLessons: string[];
  awardedChallenges: string[];
  awardedUnits: string[];
};

export function awardOnce<T extends RewardState>(
  state: T,
  bucket: RewardBucket,
  id: string,
  points: number,
): { state: T; awarded: boolean } {
  if (state[bucket].includes(id)) {
    return { state, awarded: false };
  }
  return {
    awarded: true,
    state: {
      ...state,
      points: state.points + points,
      [bucket]: [...state[bucket], id],
    },
  };
}
