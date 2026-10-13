"use client";

import { useState } from "react";
import { ChoiceButton } from "@/components/ui/Button";
import { FeedbackBanner } from "@/components/ui/Feedback";
import { Multiline } from "@/components/ui/Text";
import { setsMatch } from "@/lib/activities";
import type { TapToIdentifyActivity } from "@/content/types";

export function TapToIdentify({
  activity,
  onAttempt,
  onResolve,
}: {
  activity: TapToIdentifyActivity;
  onAttempt: (correct: boolean) => void;
  onResolve: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [revealed, setRevealed] = useState(false);
  const solved = status === "correct" || revealed;

  function toggle(id: string) {
    if (solved) return;
    setStatus("idle");
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function check() {
    const correct = setsMatch(selected, activity.correctIds);
    onAttempt(correct);
    if (correct) {
      setStatus("correct");
      onResolve();
      return;
    }
    setStatus("incorrect");
  }

  function showAnswer() {
    setSelected(activity.correctIds);
    setRevealed(true);
    setStatus("correct");
    onResolve();
  }

  return (
    <div className="space-y-4">
      <p className="text-xl font-bold">{activity.instruction}</p>
      <div
        role="group"
        aria-label={activity.presentation === "phone" ? "Practice phone" : activity.instruction}
        className={
          activity.presentation === "phone"
            ? "grid grid-cols-2 gap-3 rounded-3xl border-4 border-ink bg-white p-4"
            : "space-y-3"
        }
      >
        {activity.options.map((option) => {
          const isSelected = selected.includes(option.id);
          const counted = activity.correctIds.includes(option.id);
          let marker: string | undefined;
          if (isSelected && !solved) marker = "Selected";
          if (solved && counted) marker = "Counted";
          if (solved && !counted) marker = "Not counted";
          return (
            <ChoiceButton
              key={option.id}
              pressed={isSelected || (solved && counted)}
              marker={marker}
              disabled={solved}
              onClick={() => toggle(option.id)}
            >
              <span className="inline-flex items-center gap-3">
                {option.icon ? <span aria-hidden="true">{option.icon}</span> : null}
                <span>{option.label}</span>
              </span>
            </ChoiceButton>
          );
        })}
      </div>
      {!solved ? (
        <button
          type="button"
          onClick={check}
          className="min-h-14 w-full rounded-xl border-2 border-navy bg-navy px-4 py-3 font-bold text-white"
        >
          Check answers
        </button>
      ) : null}
      {status === "correct" || revealed ? (
        <FeedbackBanner tone="correct" title="Correct">
          <Multiline text={activity.correctFeedback} />
        </FeedbackBanner>
      ) : null}
      {status === "incorrect" && !revealed ? (
        <div className="space-y-3">
          <FeedbackBanner tone="incorrect" title="Not quite">
            <Multiline text={activity.incorrectFeedback} />
          </FeedbackBanner>
          <button
            type="button"
            onClick={showAnswer}
            className="min-h-14 w-full rounded-xl border-2 border-ink bg-surface px-4 py-3 font-bold"
          >
            Show the answer
          </button>
        </div>
      ) : null}
    </div>
  );
}
