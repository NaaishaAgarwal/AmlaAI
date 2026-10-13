"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/Button";
import { CompassBadge } from "@/components/ui/Progress";
import { unit1 } from "@/content/unit-1";
import { isLessonUnlocked, resumeTarget } from "@/lib/progress";
import { useProgress } from "@/lib/progress-context";

export function UnitOverview() {
  const router = useRouter();
  const { ready, state, reset } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const resume = ready ? resumeTarget(state, unit1.lessons) : null;

  return (
    <>
      <AppHeader />
      <main id="main" className="mx-auto w-full max-w-3xl px-5 py-8">
        <p className="font-bold text-navy">Unit 1</p>
        <h1 className="mt-2 text-4xl font-bold leading-tight">Meet AI</h1>
        <p className="mt-4 max-w-[40rem] leading-relaxed">{unit1.purpose}</p>
        <p className="mt-4 max-w-[40rem] text-xl font-semibold leading-relaxed">“{unit1.promise}”</p>
        <p className="mt-4 font-bold">{unit1.minutes}</p>

        <section className="mt-8 rounded-2xl border-2 border-ink bg-surface p-5" aria-label="Your progress">
          <p className="text-2xl font-bold">{ready ? state.points : "…"} AI Points</p>
          <div className="mt-4">
            <CompassBadge earned={state.badgeEarned} />
          </div>
          <p className="mt-3 leading-relaxed">{unit1.badge.description}</p>
          {state.badgeEarned ? (
            <div className="mt-4 max-w-xs">
              <Button onClick={() => router.push("/unit-complete")}>Review your badge</Button>
            </div>
          ) : (
            <p className="mt-3 font-semibold">Finish all five lessons to earn this badge.</p>
          )}
        </section>

        {resume ? (
          <div className="mt-6 max-w-sm">
            <Button onClick={() => router.push(`/lesson/${resume.lessonId}?screen=${resume.screen}`)}>
              Resume
            </Button>
          </div>
        ) : null}

        <section className="mt-8" aria-labelledby="lesson-path">
          <h2 id="lesson-path" className="text-2xl font-bold">
            Lessons
          </h2>
          <ol className="mt-4 space-y-4">
            {unit1.lessons.map((lesson, index) => {
              const unlocked = ready && isLessonUnlocked(state, unit1.lessons, index);
              const status = state.lessons[lesson.id]?.status ?? "not_started";
              const current = state.lessons[lesson.id]?.currentScreen ?? 0;
              let action = "Loading";
              let href = `/lesson/${lesson.id}?screen=0`;
              if (ready && !unlocked) action = "Locked";
              if (ready && unlocked && status === "not_started") action = "Start";
              if (ready && unlocked && status === "in_progress") {
                action = "Resume";
                href = `/lesson/${lesson.id}?screen=${current}`;
              }
              if (ready && unlocked && status === "completed") {
                action = "Review";
                href = `/lesson/${lesson.id}?screen=0`;
              }
              return (
                <li key={lesson.id} className="rounded-2xl border-2 border-ink bg-surface p-5">
                  <p className="font-bold text-navy">Lesson {lesson.number}</p>
                  <h3 className="mt-1 text-2xl font-bold">{lesson.title}</h3>
                  <p className="mt-2 leading-relaxed">{lesson.subtitle}</p>
                  <p className="mt-2 font-semibold">About {lesson.minutes} minutes</p>
                  <p className="mt-2 font-semibold">
                    {!ready
                      ? "Loading your progress"
                      : status === "completed"
                        ? "Completed"
                        : status === "in_progress"
                          ? "In progress"
                          : unlocked
                            ? "Ready"
                            : "Locked until the previous lesson is complete"}
                  </p>
                  <div className="mt-4 max-w-xs">
                    {ready && unlocked ? (
                      <Link
                        href={href}
                        className="inline-flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-navy bg-navy px-4 py-3 font-bold text-white"
                      >
                        {action}
                      </Link>
                    ) : (
                      <Button disabled>{action}</Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mt-8 rounded-2xl border-2 border-ink bg-white p-5">
          <h2 className="text-2xl font-bold">Privacy</h2>
          <p className="mt-3 leading-relaxed">
            Your progress stays in this browser on this device. It is not sent to a server, and it will not appear on another computer or phone.
          </p>
          {!confirmReset ? (
            <div className="mt-4 max-w-sm">
              <Button variant="secondary" onClick={() => setConfirmReset(true)}>
                Reset progress on this device
              </Button>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <p className="font-semibold">This clears lessons, points, and the badge on this browser.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  onClick={() => {
                    reset();
                    setConfirmReset(false);
                  }}
                >
                  Yes, reset
                </Button>
                <Button variant="secondary" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
