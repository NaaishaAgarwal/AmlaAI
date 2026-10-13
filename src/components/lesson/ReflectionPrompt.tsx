"use client";

import { useState } from "react";
import { ChoiceButton } from "@/components/ui/Button";
import { FeedbackBanner } from "@/components/ui/Feedback";
import { Multiline, RichText } from "@/components/ui/Text";
import type { ReflectionActivity } from "@/content/types";

export function ReflectionPrompt({
  activity,
  heading,
  onChoose,
}: {
  activity: ReflectionActivity;
  heading: boolean;
  onChoose: (optionId: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const QuestionTag = heading ? "h1" : "h2";
  const feedback =
    (selected && activity.feedbackByOption?.[selected]) || activity.feedback || "There is no wrong answer.";

  return (
    <div className="space-y-4">
      <QuestionTag
        id={heading ? "screen-heading" : undefined}
        tabIndex={heading ? -1 : undefined}
        className="text-3xl font-bold leading-tight outline-none"
      >
        <RichText text={activity.question} />
      </QuestionTag>
      <div className="space-y-3">
        {activity.options.map((option) => (
          <ChoiceButton
            key={option.id}
            pressed={selected === option.id}
            marker={selected === option.id ? "Selected" : undefined}
            onClick={() => {
              setSelected(option.id);
              onChoose(option.id);
            }}
          >
            <span className="inline-flex items-center gap-3">
              {option.icon ? <span aria-hidden="true">{option.icon}</span> : null}
              <span>{option.label}</span>
            </span>
          </ChoiceButton>
        ))}
      </div>
      {selected ? (
        <FeedbackBanner tone="neutral" title="No wrong answer">
          <Multiline text={feedback} />
        </FeedbackBanner>
      ) : null}
    </div>
  );
}
