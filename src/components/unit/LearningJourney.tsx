"use client";

import { useState } from "react";
import Image from "next/image";
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
      <main id="main" className="mx-auto w-full max-w-[1100px] px-4 py-5 md:px-6 md:py-8">
        <section className="grid items-center gap-4 sm:grid-cols-[minmax(0,1fr)_8.5rem] lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-8">
          <div>
            <h1 className="text-[clamp(1.7rem,4vw,2.6rem)] font-bold leading-tight">Your AI Learning Journey</h1>
            <p className="mt-2 max-w-xl text-[clamp(1.05rem,2vw,1.25rem)] leading-snug">
              Discover AI one step at a time. Learn the basics, practice with real examples, and build confidence at your own pace.
            </p>
            <div className="mt-4 max-w-xs">
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
          </div>
          <Image
            src="/amla.png"
            alt=""
            width={830}
            height={770}
            priority
            className="mx-auto h-auto w-28 sm:w-full lg:row-span-2 lg:max-w-xs lg:self-center"
          />
          <section className="rounded-2xl border-2 border-ink bg-surface p-4 sm:col-span-2 lg:col-span-1" aria-label="Your progress">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xl font-bold leading-tight">{ready ? state.points : "…"} AI Points</p>
                <p className="mt-1 font-semibold leading-snug">
                  Unit 1 · {ready ? `${completed} of ${total} lessons` : "Loading your progress"}
                </p>
              </div>
              <CompassBadge earned={state.badgeEarned} compact />
            </div>
            <div
              className="mt-3 h-3 overflow-hidden rounded-full border-2 border-ink bg-white"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={ready ? percent : undefined}
              aria-label="Unit 1 lesson progress"
            >
              <div className="h-full bg-coral" style={{ width: `${ready ? percent : 0}%` }} />
            </div>
            <p className="mt-2 font-bold leading-snug">{state.badgeEarned ? "AI Explorer" : "AI Explorer badge locked"}</p>
          </section>
        </section>

        <section className="mt-8" aria-labelledby="learning-path">
          <h2 id="learning-path" className="text-[clamp(1.4rem,3vw,2rem)] font-bold leading-tight">
            Learning path
          </h2>
          <p className="mt-1 max-w-xl leading-snug">
            Five units, in order. Unit 1 is ready now. The later units will open when they are built.
          </p>
          <ol className="relative mt-5 space-y-4 md:mt-6 md:space-y-6">
            <div
              aria-hidden="true"
              className="absolute bottom-4 left-[0.55rem] top-4 w-1 rounded-full bg-navy/25 md:left-1/2 md:-translate-x-1/2"
            />
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
                <li
                  key={unit.id}
                  className={`relative pl-8 md:flex md:pl-0 ${index % 2 === 0 ? "md:justify-start" : "md:justify-end"}`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-5 z-10 h-4 w-4 rounded-full border-2 border-ink md:left-1/2 md:top-7 md:h-5 md:w-5 md:-translate-x-1/2 ${
                      status === "Completed" ? "bg-coral" : current ? "bg-navy" : "bg-surface"
                    }`}
                  />
                  <article
                    className={`w-full rounded-2xl border-2 bg-surface p-4 md:w-[calc(50%-2rem)] md:p-5 ${
                      current ? "border-coral" : "border-ink"
                    }`}
                  >
                    <p className="font-bold text-navy">Unit {unit.number}</p>
                    <h3 className="mt-1 text-xl font-bold leading-tight md:text-2xl">{unit.title}</h3>
                    <p className="mt-2 leading-snug">{unit.description}</p>
                    <p className="mt-2 font-semibold">{status}</p>
                    {isUnitOne ? (
                      <p className="mt-1 font-semibold">
                        {ready ? `${completed} of ${total} lessons · ${percent}%` : "Progress loads with this browser."}
                      </p>
                    ) : null}
                    <div className="mt-3">
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

        <section className="mt-8 rounded-2xl border-2 border-ink bg-surface p-4 md:p-5">
          <h2 className="text-xl font-bold md:text-2xl">Privacy</h2>
          <p className="mt-2 max-w-xl leading-snug">
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
        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink pt-4">
          <p className="font-bold">Amla AI</p>
          <nav aria-label="Footer" className="flex gap-4 font-bold">
            <Link href="/" className="inline-flex min-h-[44px] items-center underline-offset-4 hover:underline">
              Home
            </Link>
            <Link href="/unit-1" className="inline-flex min-h-[44px] items-center underline-offset-4 hover:underline">
              Unit 1
            </Link>
          </nav>
        </footer>
      </main>
    </>
  );
}
