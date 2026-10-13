"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/Button";
import { CompassBadge, SkillMeter } from "@/components/ui/Progress";
import { unit1 } from "@/content/unit-1";
import { canCompleteUnit, completeUnit, unitLessonIds } from "@/lib/progress";
import { useProgress } from "@/lib/progress-context";
import { UNIT_POINTS } from "@/lib/rewards";

export function UnitComplete() {
  const router = useRouter();
  const { ready, state, update } = useProgress();
  const [alreadyAwarded, setAlreadyAwarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (!ready) return;
    update((prev) => completeUnit(prev, unit1.id, unitLessonIds, unit1.challengeId).state);
  }, [ready, update]);

  if (ready && alreadyAwarded === null) {
    setAlreadyAwarded(state.awardedUnits.includes(unit1.id));
  }

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

  const eligible = canCompleteUnit(state, unitLessonIds, unit1.challengeId) || state.unitCompleted;

  if (!eligible) {
    return (
      <>
        <AppHeader />
        <main id="main" className="mx-auto w-full max-w-[40rem] px-5 py-8">
          <h1 className="text-3xl font-bold leading-tight">Finish Unit 1 to earn your badge.</h1>
          <p className="mt-4 leading-relaxed">
            Complete all five lessons, including your first AI mission, and this page will celebrate that progress.
          </p>
          <div className="mt-6 max-w-xs">
            <Button onClick={() => router.push("/")}>Home</Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main id="main" className="mx-auto w-full max-w-[40rem] px-5 py-8">
        <p className="text-2xl font-bold">Congratulations!</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight">You&apos;ve completed Unit 1!</h1>
        <p className="mt-4 text-2xl font-bold">You are now an AI Explorer.</p>
        <div className="mt-6">
          <CompassBadge earned />
        </div>
        <p className="mt-4 leading-relaxed">{unit1.badge.description}</p>
        <h2 className="mt-8 text-2xl font-bold">You learned</h2>
        <ul className="mt-4 space-y-3">
          {unit1.learned.map((item) => (
            <li key={item} className="rounded-xl border-2 border-ink bg-surface px-4 py-3 font-semibold">
              <span aria-hidden="true">✓ </span>
              {item}
            </li>
          ))}
        </ul>
        <h2 className="mt-8 text-2xl font-bold">Your new skills</h2>
        <div className="mt-4 space-y-4">
          {unit1.skills.map((skill) => (
            <SkillMeter key={skill.name} name={skill.name} percent={skill.percent} />
          ))}
        </div>
        <p className="mt-6 font-bold">
          {alreadyAwarded ? "You already earned these points." : `+${UNIT_POINTS} AI Points`}
        </p>
        <p className="mt-2 font-semibold">{state.points} AI Points</p>
        <div className="mt-8 space-y-3">
          {unit1.finalMessage.map((line) => (
            <p key={line} className="leading-relaxed">
              {line}
            </p>
          ))}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button onClick={() => router.push("/unit-2")}>Continue to Unit 2</Button>
          <Button variant="secondary" onClick={() => router.push("/")}>
            Home
          </Button>
        </div>
      </main>
    </>
  );
}
