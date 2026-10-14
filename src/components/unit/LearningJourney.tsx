"use client";

import { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/Button";
import { CompassBadge } from "@/components/ui/Progress";
import { journeyUnits } from "@/content/journey";
import { unit1 } from "@/content/unit-1";
import { countCompletedLessons, resumeTarget } from "@/lib/progress";
import { useProgress } from "@/lib/progress-context";

function unitOneAction(ready: boolean, completed: number, total: number, href: string) {
  if (!ready) return { label: "Loading", href: "/unit-1", enabled: false };
  if (completed === 0 && href === "/unit-1") return { label: "Start Unit 1", href, enabled: true };
  if (completed === total) return { label: "Review Unit 1", href: "/unit-1", enabled: true };
  return { label: "Continue", href, enabled: true };
}

export function LearningJourney() {
  const { ready, state, reset } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const lessonIds = unit1.lessons.map((lesson) => lesson.id);
  const completed = ready ? countCompletedLessons(state, lessonIds) : 0;
  const total = unit1.lessons.length;
  const started =
    ready &&
    unit1.lessons.some((lesson) => {
      const status = state.lessons[lesson.id]?.status;
      return status === "in_progress" || status === "completed";
    });
  const resume = ready ? resumeTarget(state, unit1.lessons) : null;
  const nextLesson = unit1.lessons.find((lesson) => state.lessons[lesson.id]?.status !== "completed");
  const continueHref = resume
    ? `/lesson/${resume.lessonId}?screen=${resume.screen}`
    : nextLesson && started
      ? `/lesson/${nextLesson.id}?screen=0`
      : "/unit-1";
  const welcome =
    completed === total
      ? { label: "Review Unit 1", href: "/unit-1" }
      : started
        ? { label: "Continue learning", href: continueHref }
        : { label: "Start Unit 1", href: "/unit-1" };
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <>
      <AppHeader />
      <main id="main" className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
          <section>
            <h1 className="text-4xl font-bold leading-tight">Your AI Learning Journey</h1>
            <p className="mt-4 max-w-[40rem] text-xl leading-relaxed">
              Discover AI one step at a time. Learn the basics, practice with real examples, and build confidence at your own pace.
            </p>
            <div className="mt-6 max-w-xs">
              {ready ? (
                <Link
                  href={welcome.href}
                  className="inline-flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-navy bg-navy px-4 py-3 font-bold text-white hover:bg-navy-strong"
                >
                  {welcome.label}
                </Link>
              ) : (
                <Button disabled>Loading</Button>
              )}
            </div>
          </section>
          <section className="rounded-2xl border-2 border-ink bg-surface p-5" aria-label="Your progress">
            <p className="text-2xl font-bold">{ready ? state.points : "…"} AI Points</p>
            <p className="mt-2 font-semibold">
              Unit 1 · {ready ? `${completed} of ${total} lessons` : "Loading your progress"}
            </p>
            <div
              className="mt-3 h-4 overflow-hidden rounded-full border-2 border-ink bg-white"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={ready ? percent : undefined}
              aria-label="Unit 1 lesson progress"
            >
              <div className="h-full bg-coral" style={{ width: `${ready ? percent : 0}%` }} />
            </div>
            <div className="mt-4">
              <CompassBadge earned={state.badgeEarned} />
            </div>
          </section>
        </div>

        <section className="mt-12" aria-labelledby="learning-path">
          <h2 id="learning-path" className="text-3xl font-bold">
            Learning path
          </h2>
          <p className="mt-2 max-w-[40rem] leading-relaxed">
            Five units, in order. Unit 1 is ready now. The later units will open when they are built.
          </p>
          <ol className="relative mx-auto mt-8 max-w-5xl space-y-8">
            <div aria-hidden="true" className="absolute bottom-10 left-1/2 top-10 w-1 -translate-x-1/2 rounded-full bg-navy/25" />
            {journeyUnits.map((unit, index) => {
              const isUnitOne = unit.id === unit1.id;
              const status = !unit.available
                ? "Coming soon"
                : !ready
                  ? "Loading your progress"
                  : completed === total
                    ? "Completed"
                    : started
                      ? "In progress"
                      : "Ready to start";
              const action = isUnitOne
                ? unitOneAction(ready, completed, total, continueHref)
                : { label: "Coming soon", href: "", enabled: false };
              const current = isUnitOne && ready && completed < total;
              return (
                <li key={unit.id} className={`relative flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <span
                    aria-hidden="true"
                    className={`absolute left-1/2 top-8 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-ink ${
                      status === "Completed" ? "bg-coral" : current ? "bg-navy" : "bg-surface"
                    }`}
                  />
                  <article
                    className={`relative w-[calc(50%-2.75rem)] rounded-2xl border-2 bg-surface p-6 ${
                      current ? "border-coral" : "border-ink"
                    }`}
                  >
                    <p className="font-bold text-navy">Unit {unit.number}</p>
                    <h3 className="mt-1 text-2xl font-bold leading-tight">{unit.title}</h3>
                    <p className="mt-3 leading-relaxed">{unit.description}</p>
                    <p className="mt-3 font-semibold">{status}</p>
                    {isUnitOne ? (
                      <p className="mt-1 font-semibold">
                        {ready ? `${completed} of ${total} lessons · ${percent}%` : "Progress loads with this browser."}
                      </p>
                    ) : null}
                    <div className="mt-4 max-w-xs">
                      {action.enabled ? (
                        <Link
                          href={action.href}
                          className="inline-flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-navy bg-navy px-4 py-3 font-bold text-white hover:bg-navy-strong"
                        >
                          {action.label}
                        </Link>
                      ) : (
                        <Button disabled>{action.label}</Button>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mt-12 rounded-2xl border-2 border-ink bg-surface p-6">
          <h2 className="text-2xl font-bold">Privacy</h2>
          <p className="mt-3 max-w-[40rem] leading-relaxed">
            Your progress stays in this browser on this device. It is not sent to a server, and it will not appear on another computer or phone.
          </p>
          {!confirmReset ? (
            <div className="mt-4 max-w-sm">
              <Button variant="secondary" onClick={() => setConfirmReset(true)}>
                Reset progress on this device
              </Button>
            </div>
          ) : (
            <div className="mt-4 max-w-xl space-y-3">
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
