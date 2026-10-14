"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/Button";
import { SkillMeter } from "@/components/ui/Progress";
import { RichText } from "@/components/ui/Text";
import { BlockView } from "@/components/lesson/BlockView";
import { FollowUpChat, PracticeChat } from "@/components/lesson/ChatPanels";
import { AiResponse, FreeResponse, MissionCheck, TopicChoice } from "@/components/lesson/LessonInputs";
import { MultipleChoice } from "@/components/lesson/MultipleChoice";
import { ReflectionPrompt } from "@/components/lesson/ReflectionPrompt";
import { ScenarioDecision } from "@/components/lesson/ScenarioDecision";
import { TapToIdentify } from "@/components/lesson/TapToIdentify";
import { activityQuestionIsHeading, type ContentScreen, type TopicChoiceActivity } from "@/content/types";
import { lessonById, lessonIndex, unit1 } from "@/content/unit-1";
import { canCompleteMission } from "@/lib/activities";
import { scriptedAssistant } from "@/lib/assistant/scripted";
import { emptyChat, readChat, writeChat } from "@/lib/chat-session";
import {
  clampScreen,
  completeChallenge,
  completeLesson,
  emptyLessonProgress,
  isLessonUnlocked,
  markScreenComplete,
  recordPromptProgress,
  recordQuiz,
  recordReflection,
  visitLesson,
  rewindLesson,
} from "@/lib/progress";
import { useProgress } from "@/lib/progress-context";
import { LESSON_POINTS } from "@/lib/rewards";

const ASK_FORM_ID = "ask-ai-form";

// Set in the click handler before the address changes. Progress state can commit
// a render later, and this map lets that render keep the screen just opened.
const reachedScreens = new Map<string, number>();

function allowReachedScreen(lessonId: string, screen: number) {
  const current = reachedScreens.get(lessonId) ?? 0;
  if (screen > current) reachedScreens.set(lessonId, screen);
}

function reachedScreen(lessonId: string) {
  return reachedScreens.get(lessonId) ?? 0;
}

function topicIsReady(activity: TopicChoiceActivity, topicId: string, customTopic: string) {
  if (!topicId) return false;
  if (topicId !== activity.otherId) return true;
  return customTopic.trim().length >= 2;
}

export function LessonPlayer({
  params,
  searchParams,
}: {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ screen?: string | string[] }>;
}) {
  const { lessonId } = use(params);
  const query = use(searchParams);
  const router = useRouter();
  const { ready, state, update } = useProgress();
  const lesson = lessonById(lessonId);
  const rawScreen = Array.isArray(query.screen) ? query.screen[0] : query.screen;
  const [chat, setChat] = useState(emptyChat);
  const [topicId, setTopicId] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [awardNotes, setAwardNotes] = useState<Record<string, boolean>>({});

  const saved = lesson ? state.lessons[lesson.id] : undefined;
  const lastIndex = lesson ? lesson.screens.length - 1 : 0;
  const storedFurthest =
    saved?.status === "completed" ? lastIndex : (saved?.furthestScreen ?? 0);
  const allowedFurthest = Math.max(storedFurthest, lesson ? reachedScreen(lesson.id) : 0);
  const requested =
    rawScreen === undefined ? (saved?.currentScreen ?? 0) : Number(rawScreen);
  const screenIndex = lesson ? clampScreen(requested, allowedFurthest, lastIndex) : 0;
  const screen = lesson?.screens[screenIndex];
  const progress = saved ?? emptyLessonProgress();

  useEffect(() => {
    if (!ready || !lesson) return;
    if (!isLessonUnlocked(state, unit1.lessons, lessonIndex(lesson.id))) return;
    const current = state.lessons[lesson.id];
    const last = lesson.screens.length - 1;
    const furthest =
      current?.status === "completed"
        ? last
        : Math.max(current?.furthestScreen ?? 0, reachedScreen(lesson.id));
    const asked = rawScreen === undefined ? (current?.currentScreen ?? 0) : Number(rawScreen);
    const next = clampScreen(asked, furthest, last);
    if (rawScreen !== String(next)) {
      router.replace(`/lesson/${lesson.id}?screen=${next}`);
      return;
    }
    update((prev) => {
      const lessonProgress = prev.lessons[lesson.id];
      if (
        prev.activeLessonId === lesson.id &&
        lessonProgress &&
        lessonProgress.currentScreen === next &&
        lessonProgress.status !== "not_started"
      ) {
        return prev;
      }
      return visitLesson(prev, lesson.id, next);
    });
  }, [ready, lesson, rawScreen, router, state, state.lessons, update]);

  useEffect(() => {
    if (!ready || !lesson || screen?.kind !== "completion") return;
    update((prev) => completeLesson(prev, lesson.id, lesson.screens.length - 1).state);
  }, [ready, lesson, screen, update]);

  useEffect(() => {
    if (!ready || !lesson) return;
    const session = readChat(lesson.id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChat(session);
    if (session.topicId) {
      setTopicId(session.topicId);
      if (session.topicId === "other") setCustomTopic(session.topicLabel);
    }
  }, [ready, lesson, screenIndex]);

  useEffect(() => {
    if (!ready) return;
    document.getElementById("screen-heading")?.focus();
  }, [ready, lessonId, screenIndex]);

  if (!ready) {
    return (
      <>
        <AppHeader />
        <main id="main" className="mx-auto w-full max-w-[40rem] px-5 py-8">
          <p>Loading your progress…</p>
        </main>
      </>
    );
  }

  if (!lesson || !screen) {
    return (
      <>
        <AppHeader />
        <main id="main" className="mx-auto w-full max-w-[40rem] px-5 py-8">
          <h1 className="text-3xl font-bold">That lesson is not available.</h1>
          <div className="mt-6 max-w-xs">
            <Button onClick={() => router.push("/")}>Home</Button>
          </div>
        </main>
      </>
    );
  }

  const index = lessonIndex(lesson.id);
  if (!isLessonUnlocked(state, unit1.lessons, index)) {
    return (
      <>
        <AppHeader />
        <main id="main" className="mx-auto w-full max-w-[40rem] px-5 py-8">
          <h1 id="screen-heading" tabIndex={-1} className="text-3xl font-bold outline-none">
            Finish the previous lesson to unlock this one.
          </h1>
          <div className="mt-6 max-w-xs">
            <Button onClick={() => router.push("/")}>Home</Button>
          </div>
        </main>
      </>
    );
  }

  if (
    screen.kind === "completion" &&
    awardNotes[lesson.id] === undefined
  ) {
    setAwardNotes((current) =>
      current[lesson.id] === undefined
        ? { ...current, [lesson.id]: state.awardedLessons.includes(lesson.id) }
        : current,
    );
  }

  function goTo(nextIndex: number) {
    allowReachedScreen(lesson!.id, nextIndex);
    update((prev) => visitLesson(prev, lesson!.id, nextIndex));
    router.push(`/lesson/${lesson!.id}?screen=${nextIndex}`);
  }

  function saveTopic() {
    if (screen?.kind !== "content" || screen.activity?.type !== "topic-choice") return;
    const option = screen.activity.options.find((item) => item.id === topicId);
    const label = topicId === screen.activity.otherId ? customTopic.trim() : (option?.label ?? "");
    const existing = readChat(lesson!.id);
    const changed = existing.topicId !== "" && existing.topicId !== topicId;
    const nextSession = {
      ...existing,
      topicId,
      topicLabel: label,
      ...(changed && !progress.challengeCompleted
        ? {
            messages: [],
            replyId: null,
            promptSubmitted: false,
            answerReceived: false,
            followUpSubmitted: false,
          }
        : {}),
    };
    writeChat(lesson!.id, nextSession);
    setChat(nextSession);
    if (changed && !progress.challengeCompleted) {
      update((prev) =>
        rewindLesson(
          recordPromptProgress(prev, lesson!.id, {
            promptSubmitted: false,
            answerReceived: false,
            followUpSubmitted: false,
          }),
          lesson!.id,
          screenIndex + 1,
          ["prompt", "response", "did-you-notice", "follow-up", "mission", "reflection"],
        ),
      );
    }
  }

  function finishLesson() {
    update((prev) =>
      completeLesson(
        markScreenComplete(prev, lesson!.id, screen!.id),
        lesson!.id,
        lastIndex,
      ).state,
    );
    router.push("/unit-complete");
  }

  function continueForward() {
    if (screen?.kind === "content" && screen.activity?.type === "topic-choice") {
      saveTopic();
    }
    if (screenIndex < lastIndex) {
      update((prev) => markScreenComplete(prev, lesson!.id, screen!.id));
      goTo(screenIndex + 1);
      return;
    }
    if (screen?.kind === "completion" && screen.nextLessonId) {
      router.push(`/lesson/${screen.nextLessonId}?screen=0`);
      return;
    }
    finishLesson();
  }

  function askAi(text: string) {
    if (!lesson || !screen) return;
    const session = readChat(lesson.id);
    const reply = scriptedAssistant.reply({
      prompt: text,
      topicId: session.topicId || undefined,
    });
    const nextSession = {
      ...session,
      messages: [
        { role: "learner" as const, text },
        { role: "assistant" as const, text: reply.text },
      ],
      replyId: reply.id,
      promptSubmitted: true,
      answerReceived: true,
      followUpSubmitted: progress.challengeCompleted ? session.followUpSubmitted : false,
    };
    writeChat(lesson.id, nextSession);
    setChat(nextSession);
    update((prev) =>
      rewindLesson(
        recordPromptProgress(markScreenComplete(prev, lesson.id, screen.id), lesson.id, {
          promptSubmitted: true,
          answerReceived: true,
          followUpSubmitted: progress.challengeCompleted,
        }),
        lesson.id,
        screenIndex + 1,
        ["did-you-notice", "follow-up", "mission", "reflection"],
      ),
    );
    goTo(screenIndex + 1);
  }

  const asking = screen.kind === "content" && screen.activity?.type === "free-response";
  const open =
    screen.kind === "completion" ||
    !screen.activity ||
    screen.activity.type === "safety" ||
    asking ||
    progress.completedScreens.includes(screen.id) ||
    (screen.activity.type === "topic-choice" &&
      topicIsReady(screen.activity, topicId, customTopic)) ||
    (screen.activity.type === "ai-response" &&
      (chat.answerReceived || progress.answerReceived || progress.status === "completed"));

  const forwardLabel =
    screen.kind === "completion" ? screen.forwardLabel : (screen.forwardLabel ?? "Continue");

  let hint: string | null = null;
  if (!open && screen.kind === "content" && screen.activity) {
    if (screen.activity.type === "multiple-choice" || screen.activity.type === "scenario") {
      hint = "Choose the best answer to continue.";
    } else if (screen.activity.type === "tap-to-identify") {
      hint = "Check your answers to continue.";
    } else if (screen.activity.type === "reflection" || screen.activity.type === "mission") {
      hint = "Choose an option to continue.";
    } else if (screen.activity.type === "practice-chat") {
      hint = "Send a question to continue.";
    } else if (screen.activity.type === "follow-up") {
      hint = "Choose a follow-up to continue.";
    } else if (screen.activity.type === "topic-choice") {
      hint = "Choose a topic to continue.";
    } else if (screen.activity.type === "ai-response") {
      hint = "Go back and ask a question to continue.";
    }
  }

  return (
    <>
      <AppHeader />
      <main id="main" className="mx-auto flex w-full max-w-[40rem] flex-col px-5 py-6">
        <p className="font-bold">
          Lesson {lesson.number} of {unit1.lessons.length} · {lesson.title}
        </p>
        <p className="mt-2 text-muted">
          Step {screenIndex + 1} of {lesson.screens.length} · About {lesson.minutes} minutes
        </p>
        <article className="mt-6 space-y-5">
          {screen.kind === "completion" ? (
            <div className="space-y-5">
              <h1 id="screen-heading" tabIndex={-1} className="text-3xl font-bold leading-tight outline-none">
                <RichText text={screen.heading} />
              </h1>
              {screen.paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
              {screen.learned ? (
                <ul className="list-disc space-y-2 pl-6">
                  {screen.learned.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {screen.skill ? <SkillMeter name={screen.skill.name} percent={screen.skill.percent} /> : null}
              <p className="font-bold">
                {awardNotes[lesson.id]
                  ? "You already earned these points."
                  : `+${LESSON_POINTS} AI Points`}
              </p>
              <p>{state.points} AI Points</p>
            </div>
          ) : (
            <>
              <BlockView blocks={screen.blocks} />
              {renderActivity(screen)}
            </>
          )}
        </article>
        {hint ? (
          <p id="continue-hint" className="mt-6 font-semibold">
            {hint}
          </p>
        ) : null}
        <nav
          aria-label="Lesson"
          className="mt-8 grid gap-3 border-t-2 border-ink bg-paper py-4 sm:grid-cols-3"
        >
          <Button variant="secondary" onClick={() => (screenIndex === 0 ? router.push("/") : goTo(screenIndex - 1))}>
            Back
          </Button>
          <Button variant="secondary" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button
            type={asking ? "submit" : "button"}
            form={asking ? ASK_FORM_ID : undefined}
            disabled={!open}
            aria-describedby={hint ? "continue-hint" : undefined}
            onClick={asking ? undefined : continueForward}
          >
            {forwardLabel}
          </Button>
        </nav>
      </main>
    </>
  );

  function renderActivity(current: ContentScreen) {
    const activity = current.activity;
    if (!activity) return null;
    const heading = activityQuestionIsHeading(current);
    if (activity.type === "multiple-choice") {
      return (
        <MultipleChoice
          key={current.id}
          activity={activity}
          heading={heading}
          onAttempt={(correct) =>
            update((prev) => recordQuiz(prev, lesson!.id, current.id, correct))
          }
          onResolve={() => update((prev) => markScreenComplete(prev, lesson!.id, current.id))}
        />
      );
    }
    if (activity.type === "tap-to-identify") {
      return (
        <TapToIdentify
          key={current.id}
          activity={activity}
          onAttempt={(correct) =>
            update((prev) => recordQuiz(prev, lesson!.id, current.id, correct))
          }
          onResolve={() => update((prev) => markScreenComplete(prev, lesson!.id, current.id))}
        />
      );
    }
    if (activity.type === "scenario") {
      return (
        <ScenarioDecision
          key={current.id}
          activity={activity}
          heading={heading}
          onAttempt={(scenarioId, correct) =>
            update((prev) => recordQuiz(prev, lesson!.id, `${current.id}:${scenarioId}`, correct))
          }
          onResolve={() => update((prev) => markScreenComplete(prev, lesson!.id, current.id))}
        />
      );
    }
    if (activity.type === "reflection") {
      return (
        <ReflectionPrompt
          key={current.id}
          activity={activity}
          heading={heading}
          onChoose={(optionId) =>
            update((prev) =>
              markScreenComplete(
                recordReflection(prev, lesson!.id, current.id, optionId),
                lesson!.id,
                current.id,
              ),
            )
          }
        />
      );
    }
    if (activity.type === "practice-chat") {
      return (
        <PracticeChat
          key={current.id}
          lessonId={lesson!.id}
          activity={activity}
          onExchange={() => update((prev) => markScreenComplete(prev, lesson!.id, current.id))}
        />
      );
    }
    if (activity.type === "topic-choice") {
      return (
        <TopicChoice
          key={current.id}
          activity={activity}
          topicId={topicId}
          customTopic={customTopic}
          onTopicId={setTopicId}
          onCustomTopic={setCustomTopic}
        />
      );
    }
    if (activity.type === "free-response") {
      return (
        <FreeResponse
          key={current.id}
          formId={ASK_FORM_ID}
          activity={activity}
          topicLabel={chat.topicLabel}
          onAsk={askAi}
        />
      );
    }
    if (activity.type === "ai-response") {
      return <AiResponse key={current.id} messages={chat.messages} />;
    }
    if (activity.type === "follow-up") {
      return (
        <FollowUpChat
          key={current.id}
          lessonId={lesson!.id}
          actions={activity.actions}
          onSent={() => {
            setChat(readChat(lesson!.id));
            update((prev) =>
              markScreenComplete(
                recordPromptProgress(prev, lesson!.id, { followUpSubmitted: true }),
                lesson!.id,
                current.id,
              ),
            );
          }}
        />
      );
    }
    if (activity.type === "mission") {
      return (
        <MissionCheck
          key={current.id}
          activity={activity}
          promptSubmitted={progress.promptSubmitted}
          answerReceived={progress.answerReceived}
          followUpSubmitted={progress.followUpSubmitted}
          selectedId={progress.reflections[current.id]}
          onChoose={(optionId) =>
            update((prev) => {
              let next = recordReflection(prev, lesson!.id, current.id, optionId);
              const lessonProgress = next.lessons[lesson!.id] ?? emptyLessonProgress();
              const readyToFinish = canCompleteMission({
                promptSubmitted: lessonProgress.promptSubmitted,
                answerReceived: lessonProgress.answerReceived,
                followUpSubmitted: lessonProgress.followUpSubmitted,
                reasonablenessChosen: true,
              });
              if (!readyToFinish) return next;
              next = markScreenComplete(next, lesson!.id, current.id);
              return completeChallenge(next, lesson!.id, unit1.challengeId).state;
            })
          }
        />
      );
    }
    return null;
  }
}
