import { unit1 } from "@/content/unit-1";
import type { Lesson } from "@/content/types";
import {
  awardOnce,
  CHALLENGE_POINTS,
  LESSON_POINTS,
  UNIT_POINTS,
  type RewardState,
} from "@/lib/rewards";

export const PROGRESS_KEY = "meet-ai-progress-v1";

export type LessonStatus = "not_started" | "in_progress" | "completed";

export type LessonProgress = {
  status: LessonStatus;
  currentScreen: number;
  furthestScreen: number;
  startedAt?: string;
  completedAt?: string;
  completedScreens: string[];
  quizAttempts: Record<string, number>;
  quizCorrect: Record<string, boolean>;
  reflections: Record<string, string>;
  promptSubmitted: boolean;
  answerReceived: boolean;
  followUpSubmitted: boolean;
  challengeCompleted: boolean;
};

export type ProgressState = RewardState & {
  version: 1;
  textSize: "default" | "large" | "extra";
  activeLessonId?: string;
  lessons: Record<string, LessonProgress>;
  unitCompleted: boolean;
  badgeEarned: boolean;
};

export function emptyLessonProgress(): LessonProgress {
  return {
    status: "not_started",
    currentScreen: 0,
    furthestScreen: 0,
    completedScreens: [],
    quizAttempts: {},
    quizCorrect: {},
    reflections: {},
    promptSubmitted: false,
    answerReceived: false,
    followUpSubmitted: false,
    challengeCompleted: false,
  };
}

export function createEmptyProgress(): ProgressState {
  return {
    version: 1,
    textSize: "default",
    points: 0,
    awardedLessons: [],
    awardedChallenges: [],
    awardedUnits: [],
    lessons: {},
    unitCompleted: false,
    badgeEarned: false,
  };
}

function lessonOf(state: ProgressState, lessonId: string): LessonProgress {
  return state.lessons[lessonId] ?? emptyLessonProgress();
}

function withLesson(
  state: ProgressState,
  lessonId: string,
  lesson: LessonProgress,
): ProgressState {
  return {
    ...state,
    lessons: { ...state.lessons, [lessonId]: lesson },
  };
}

export function isLessonUnlocked(
  state: ProgressState,
  lessons: Lesson[],
  index: number,
): boolean {
  if (index <= 0) return true;
  const previous = lessons[index - 1];
  return state.lessons[previous.id]?.status === "completed";
}

export function clampScreen(
  requested: number,
  furthest: number,
  last: number,
): number {
  if (!Number.isFinite(requested) || requested < 0) return 0;
  return Math.min(Math.floor(requested), furthest, last);
}

export function visitLesson(
  state: ProgressState,
  lessonId: string,
  screen: number,
  now = new Date().toISOString(),
): ProgressState {
  const current = lessonOf(state, lessonId);
  return withLesson(
    { ...state, activeLessonId: lessonId },
    lessonId,
    {
      ...current,
      status: current.status === "completed" ? "completed" : "in_progress",
      startedAt: current.startedAt ?? now,
      currentScreen: screen,
      furthestScreen: Math.max(current.furthestScreen, screen),
    },
  );
}

export function markScreenComplete(
  state: ProgressState,
  lessonId: string,
  screenId: string,
): ProgressState {
  const current = lessonOf(state, lessonId);
  if (current.completedScreens.includes(screenId)) return state;
  return withLesson(state, lessonId, {
    ...current,
    completedScreens: [...current.completedScreens, screenId],
  });
}

export function recordQuiz(
  state: ProgressState,
  lessonId: string,
  screenId: string,
  correct: boolean,
): ProgressState {
  const current = lessonOf(state, lessonId);
  return withLesson(state, lessonId, {
    ...current,
    quizAttempts: {
      ...current.quizAttempts,
      [screenId]: (current.quizAttempts[screenId] ?? 0) + 1,
    },
    quizCorrect: {
      ...current.quizCorrect,
      [screenId]: current.quizCorrect[screenId] === true || correct,
    },
  });
}

export function recordReflection(
  state: ProgressState,
  lessonId: string,
  screenId: string,
  optionId: string,
): ProgressState {
  const current = lessonOf(state, lessonId);
  return withLesson(state, lessonId, {
    ...current,
    reflections: { ...current.reflections, [screenId]: optionId },
  });
}

export function rewindLesson(
  state: ProgressState,
  lessonId: string,
  furthestScreen: number,
  clearScreenIds: string[],
): ProgressState {
  const current = lessonOf(state, lessonId);
  if (current.challengeCompleted || current.status === "completed") return state;
  return withLesson(state, lessonId, {
    ...current,
    furthestScreen: Math.min(current.furthestScreen, furthestScreen),
    currentScreen: Math.min(current.currentScreen, furthestScreen),
    completedScreens: current.completedScreens.filter((id) => !clearScreenIds.includes(id)),
    followUpSubmitted: false,
    promptSubmitted: clearScreenIds.includes("prompt") ? false : current.promptSubmitted,
    answerReceived: clearScreenIds.includes("response") ? false : current.answerReceived,
  });
}
export function recordPromptProgress(
  state: ProgressState,
  lessonId: string,
  patch: Partial<
    Pick<
      LessonProgress,
      "promptSubmitted" | "answerReceived" | "followUpSubmitted"
    >
  >,
): ProgressState {
  const current = lessonOf(state, lessonId);
  return withLesson(state, lessonId, { ...current, ...patch });
}

export function completeLesson(
  state: ProgressState,
  lessonId: string,
  lastIndex: number,
  now = new Date().toISOString(),
): { state: ProgressState; awarded: boolean } {
  const reward = awardOnce(state, "awardedLessons", lessonId, LESSON_POINTS);
  const current = lessonOf(reward.state, lessonId);
  return {
    awarded: reward.awarded,
    state: withLesson(reward.state, lessonId, {
      ...current,
      status: "completed",
      completedAt: current.completedAt ?? now,
      currentScreen: lastIndex,
      furthestScreen: Math.max(current.furthestScreen, lastIndex),
    }),
  };
}

export function completeChallenge(
  state: ProgressState,
  lessonId: string,
  challengeId: string,
): { state: ProgressState; awarded: boolean } {
  const reward = awardOnce(
    state,
    "awardedChallenges",
    challengeId,
    CHALLENGE_POINTS,
  );
  const current = lessonOf(reward.state, lessonId);
  return {
    awarded: reward.awarded,
    state: withLesson(reward.state, lessonId, {
      ...current,
      challengeCompleted: true,
    }),
  };
}

export function canCompleteUnit(
  state: ProgressState,
  lessonIds: string[],
  challengeId: string,
): boolean {
  const lessonsDone = lessonIds.every(
    (id) => state.lessons[id]?.status === "completed",
  );
  const challengeDone =
    state.awardedChallenges.includes(challengeId) ||
    lessonIds.some((id) => state.lessons[id]?.challengeCompleted);
  return lessonsDone && challengeDone;
}

export function completeUnit(
  state: ProgressState,
  unitId: string,
  lessonIds: string[],
  challengeId: string,
): { state: ProgressState; awarded: boolean } {
  if (!canCompleteUnit(state, lessonIds, challengeId)) {
    return { state, awarded: false };
  }
  const reward = awardOnce(state, "awardedUnits", unitId, UNIT_POINTS);
  return {
    awarded: reward.awarded,
    state: {
      ...reward.state,
      unitCompleted: true,
      badgeEarned: true,
    },
  };
}

export function resumeTarget(
  state: ProgressState,
  lessons: Lesson[],
): { lessonId: string; screen: number } | null {
  const active = state.activeLessonId
    ? state.lessons[state.activeLessonId]
    : undefined;
  if (state.activeLessonId && active?.status === "in_progress") {
    return { lessonId: state.activeLessonId, screen: active.currentScreen };
  }
  const found = lessons.find(
    (lesson) => state.lessons[lesson.id]?.status === "in_progress",
  );
  if (!found) return null;
  return {
    lessonId: found.id,
    screen: state.lessons[found.id]?.currentScreen ?? 0,
  };
}

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function loadProgress(storage?: StorageLike | null): ProgressState {
  if (!storage) return createEmptyProgress();
  try {
    const raw = storage.getItem(PROGRESS_KEY);
    if (!raw) return createEmptyProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    if (parsed.version !== 1 || !parsed.lessons) return createEmptyProgress();
    const empty = createEmptyProgress();
    return {
      ...empty,
      ...parsed,
      awardedLessons: parsed.awardedLessons ?? [],
      awardedChallenges: parsed.awardedChallenges ?? [],
      awardedUnits: parsed.awardedUnits ?? [],
      lessons: parsed.lessons,
      points: parsed.points ?? 0,
      textSize: parsed.textSize ?? "default",
    };
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(state: ProgressState, storage?: StorageLike | null) {
  storage?.setItem(PROGRESS_KEY, JSON.stringify(state));
}

export function clearProgress(storage?: StorageLike | null) {
  storage?.removeItem(PROGRESS_KEY);
}

export const unitLessonIds = unit1.lessons.map((lesson) => lesson.id);
