"use client";

import { useState } from "react";
import { ChoiceButton } from "@/components/ui/Button";
import { FeedbackBanner } from "@/components/ui/Feedback";
import { Multiline } from "@/components/ui/Text";
import type { MultipleChoiceActivity } from "@/content/types";

export function MultipleChoice({
  activity,
  heading,
  onAttempt,
  onResolve,
}: {
  activity: MultipleChoiceActivity;
  heading: boolean;
  onAttempt: (correct: boolean) => void;
  onResolve: () => void;
}) {
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [correctId, setCorrectId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const solved = correctId === activity.correctId || revealed;
  const QuestionTag = heading ? "h1" : "h2";

  function choose(id: string) {
    if (solved) return;
    const correct = id === activity.correctId;
    onAttempt(correct);
    if (correct) {
      setCorrectId(id);
      onResolve();
      return;
    }
    setWrongIds((current) => (current.includes(id) ? current : [...current, id]));
  }

  function showAnswer() {
    setRevealed(true);
    setCorrectId(activity.correctId);
    onResolve();
  }

  return (
    <div className="space-y-4">
      <QuestionTag
        id={heading ? "screen-heading" : undefined}
        tabIndex={heading ? -1 : undefined}
        className="text-3xl font-bold leading-tight outline-none"
      >
        {activity.question}
      </QuestionTag>
      <div className="space-y-3">
        {activity.options.map((option) => {
          const isCorrect = solved && option.id === activity.correctId;
          const isWrong = wrongIds.includes(option.id) && !isCorrect;
          const marker = isCorrect ? "Correct" : isWrong ? "Not quite" : undefined;
          return (
            <ChoiceButton
              key={option.id}
              pressed={isCorrect || isWrong}
              marker={marker}
              disabled={solved}
              onClick={() => choose(option.id)}
            >
              {option.label}
            </ChoiceButton>
          );
        })}
      </div>
      {solved ? (
        <FeedbackBanner tone="correct" title="Correct">
          <Multiline text={activity.explanation} />
        </FeedbackBanner>
      ) : null}
      {!solved && wrongIds.length > 0 ? (
        <div className="space-y-3">
          <FeedbackBanner tone="incorrect" title="Not quite">
            Try another answer.
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
