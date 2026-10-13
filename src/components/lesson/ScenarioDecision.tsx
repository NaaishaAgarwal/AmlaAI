"use client";

import { useState } from "react";
import { ChoiceButton } from "@/components/ui/Button";
import { FeedbackBanner } from "@/components/ui/Feedback";
import { Multiline } from "@/components/ui/Text";
import type { ScenarioActivity } from "@/content/types";

export function ScenarioDecision({
  activity,
  heading,
  onAttempt,
  onResolve,
}: {
  activity: ScenarioActivity;
  heading: boolean;
  onAttempt: (scenarioId: string, correct: boolean) => void;
  onResolve: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [solvedCurrent, setSolvedCurrent] = useState(false);
  const scenario = activity.scenarios[index];
  const QuestionTag = heading ? "h1" : "h2";
  const finished = solvedCurrent && index === activity.scenarios.length - 1;

  function choose(id: string) {
    if (solvedCurrent) return;
    const correct = id === scenario.correctId;
    onAttempt(scenario.id, correct);
    if (correct) {
      setSolvedCurrent(true);
      setWrongIds([]);
      if (index === activity.scenarios.length - 1) onResolve();
      return;
    }
    setWrongIds((current) => (current.includes(id) ? current : [...current, id]));
  }

  function showAnswer() {
    setSolvedCurrent(true);
    setWrongIds([]);
    if (index === activity.scenarios.length - 1) onResolve();
  }

  function nextScenario() {
    setIndex((current) => current + 1);
    setSolvedCurrent(false);
    setWrongIds([]);
  }

  return (
    <div className="space-y-4">
      <QuestionTag
        id={heading ? "screen-heading" : undefined}
        tabIndex={heading ? -1 : undefined}
        className="text-3xl font-bold leading-tight outline-none"
      >
        {activity.instruction}
      </QuestionTag>
      <p className="font-bold">
        Situation {index + 1} of {activity.scenarios.length}
      </p>
      <p className="text-xl leading-relaxed">{scenario.prompt}</p>
      <div className="space-y-3">
        {activity.choices.map((choice) => {
          const isAnswer = solvedCurrent && choice.id === scenario.correctId;
          const isWrong = wrongIds.includes(choice.id);
          const marker = isAnswer ? "Correct" : isWrong ? "Not quite" : undefined;
          return (
            <ChoiceButton
              key={choice.id}
              pressed={isAnswer || isWrong}
              marker={marker}
              disabled={solvedCurrent}
              onClick={() => choose(choice.id)}
            >
              {choice.label}
            </ChoiceButton>
          );
        })}
      </div>
      {solvedCurrent ? (
        <FeedbackBanner tone="correct" title="Correct">
          <Multiline text={scenario.feedback} />
        </FeedbackBanner>
      ) : null}
      {!solvedCurrent && wrongIds.length > 0 ? (
        <div className="space-y-3">
          <FeedbackBanner tone="incorrect" title="Not quite">
            Try the other choice.
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
      {solvedCurrent && !finished ? (
        <button
          type="button"
          onClick={nextScenario}
          className="min-h-14 w-full rounded-xl border-2 border-navy bg-navy px-4 py-3 font-bold text-white"
        >
          Next situation
        </button>
      ) : null}
    </div>
  );
}
