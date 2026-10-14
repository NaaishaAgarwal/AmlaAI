import { describe, expect, it } from "vitest";
import { unit1 } from "@/content/unit-1";
import { canCompleteMission, isPromptAcceptable, setsMatch } from "@/lib/activities";
import {
  canCompleteUnit,
  completeChallenge,
  completeLesson,
  completeUnit,
  countCompletedLessons,
  createEmptyProgress,
  loadProgress,
  recordQuiz,
  saveProgress,
  visitLesson,
} from "@/lib/progress";
import { CHALLENGE_POINTS, LESSON_POINTS, UNIT_POINTS } from "@/lib/rewards";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe("progress and rewards", () => {
  it("requires a real request before a prompt counts", () => {
    expect(isPromptAcceptable("")).toBe(false);
    expect(isPromptAcceptable("Hi")).toBe(false);
    expect(isPromptAcceptable("Why does the moon change shape?")).toBe(true);
  });

  it("scores multi-select answers only when the set matches", () => {
    expect(setsMatch(["face", "music", "spam"], ["face", "music", "spam"])).toBe(true);
    expect(setsMatch(["face", "calculator"], ["face", "music", "spam"])).toBe(false);
  });

  it("awards each reward once and reloads the same points", () => {
    let state = createEmptyProgress();
    const lessonIds = unit1.lessons.map((lesson) => lesson.id);
    for (const lesson of unit1.lessons) {
      state = visitLesson(state, lesson.id, 0);
      state = completeLesson(state, lesson.id, lesson.screens.length - 1).state;
    }
    state = completeChallenge(state, "U1-L5", unit1.challengeId).state;
    state = completeUnit(state, unit1.id, lessonIds, unit1.challengeId).state;
    const again = completeUnit(
      completeChallenge(completeLesson(state, "U1-L1", 5).state, "U1-L5", unit1.challengeId).state,
      unit1.id,
      lessonIds,
      unit1.challengeId,
    ).state;

    expect(countCompletedLessons(state, lessonIds)).toBe(5);
    expect(state.points).toBe(LESSON_POINTS * 5 + CHALLENGE_POINTS + UNIT_POINTS);
    expect(again.points).toBe(state.points);
    expect(state.badgeEarned).toBe(true);

    const storage = memoryStorage();
    saveProgress(state, storage);
    expect(loadProgress(storage).points).toBe(state.points);
    expect(loadProgress(storage).lessons["U1-L1"]?.status).toBe("completed");
  });

  it("does not finish the unit before every lesson and the mission", () => {
    let state = createEmptyProgress();
    state = completeLesson(state, "U1-L1", 5).state;
    expect(countCompletedLessons(state, unit1.lessons.map((lesson) => lesson.id))).toBe(1);
    expect(canCompleteUnit(state, unit1.lessons.map((lesson) => lesson.id), unit1.challengeId)).toBe(
      false,
    );
    expect(canCompleteMission({
      promptSubmitted: true,
      answerReceived: true,
      followUpSubmitted: false,
      reasonablenessChosen: true,
    })).toBe(false);
  });

  it("records a wrong quiz answer without marking it correct", () => {
    const state = recordQuiz(createEmptyProgress(), "U1-L1", "quick-check", false);
    expect(state.lessons["U1-L1"]?.quizAttempts["quick-check"]).toBe(1);
    expect(state.lessons["U1-L1"]?.quizCorrect["quick-check"]).toBe(false);
  });
});
