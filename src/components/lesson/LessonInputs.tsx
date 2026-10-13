"use client";

import { useId, useState } from "react";
import { ChoiceButton } from "@/components/ui/Button";
import { FeedbackBanner } from "@/components/ui/Feedback";
import { Multiline } from "@/components/ui/Text";
import type { FreeResponseActivity, MissionActivity, TopicChoiceActivity } from "@/content/types";
import { canCompleteMission, isPromptAcceptable } from "@/lib/activities";
import { ChatThread, PracticeNote } from "@/components/lesson/ChatPanels";
import type { ChatMessage } from "@/lib/chat-session";

export function TopicChoice({
  activity,
  topicId,
  customTopic,
  onTopicId,
  onCustomTopic,
}: {
  activity: TopicChoiceActivity;
  topicId: string;
  customTopic: string;
  onTopicId: (id: string) => void;
  onCustomTopic: (value: string) => void;
}) {
  const fieldId = useId();
  const needsCustom = topicId === activity.otherId;

  return (
    <div className="space-y-4">
      <h1 id="screen-heading" tabIndex={-1} className="text-3xl font-bold leading-tight outline-none">
        {activity.question}
      </h1>
      <p className="leading-relaxed">You can also type your own topic.</p>
      <div className="space-y-3">
        {activity.options.map((option) => (
          <ChoiceButton
            key={option.id}
            pressed={topicId === option.id}
            marker={topicId === option.id ? "Selected" : undefined}
            onClick={() => onTopicId(option.id)}
          >
            <span className="inline-flex items-center gap-3">
              {option.icon ? <span aria-hidden="true">{option.icon}</span> : null}
              <span>{option.label}</span>
            </span>
          </ChoiceButton>
        ))}
      </div>
      {needsCustom ? (
        <div className="space-y-2">
          <label htmlFor={fieldId} className="block font-bold">
            Your topic
          </label>
          <input
            id={fieldId}
            value={customTopic}
            onChange={(event) => onCustomTopic(event.target.value)}
            className="min-h-14 w-full rounded-xl border-2 border-ink bg-white px-4 text-base"
          />
        </div>
      ) : null}
    </div>
  );
}

export function FreeResponse({
  formId,
  activity,
  topicLabel,
  onAsk,
}: {
  formId: string;
  activity: FreeResponseActivity;
  topicLabel: string;
  onAsk: (text: string) => void;
}) {
  const fieldId = useId();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState(false);

  return (
    <form
      id={formId}
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!isPromptAcceptable(draft)) {
          setError(true);
          return;
        }
        setError(false);
        onAsk(draft.trim());
      }}
    >
      {topicLabel ? <p className="font-bold">Your topic: {topicLabel}</p> : null}
      <p className="font-bold">Example prompts</p>
      <div className="space-y-3">
        {activity.examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setDraft(example);
              setError(false);
            }}
            className="min-h-14 w-full rounded-xl border-2 border-ink bg-surface px-4 py-3 text-left font-semibold"
          >
            {example}
          </button>
        ))}
      </div>
      <label htmlFor={fieldId} className="block font-bold">
        Your question
      </label>
      <textarea
        id={fieldId}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        rows={5}
        className="w-full rounded-xl border-2 border-ink bg-white p-4 text-base leading-relaxed"
      />
      {error ? (
        <FeedbackBanner tone="incorrect" title="Not quite">
          Add a question or request, then try again.
        </FeedbackBanner>
      ) : null}
    </form>
  );
}

export function AiResponse({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="space-y-4">
      <PracticeNote />
      {messages.length === 0 ? (
        <p className="leading-relaxed">
          Your prepared answer is saved only in this browser tab. Go back one step and choose Ask AI again.
        </p>
      ) : (
        <ChatThread messages={messages} />
      )}
    </div>
  );
}

export function MissionCheck({
  activity,
  promptSubmitted,
  answerReceived,
  followUpSubmitted,
  selectedId,
  onChoose,
}: {
  activity: MissionActivity;
  promptSubmitted: boolean;
  answerReceived: boolean;
  followUpSubmitted: boolean;
  selectedId?: string;
  onChoose: (optionId: string) => void;
}) {
  const checks = [
    { label: activity.steps[0], done: promptSubmitted },
    { label: activity.steps[1], done: answerReceived },
    { label: activity.steps[2], done: followUpSubmitted },
    { label: activity.steps[3], done: Boolean(selectedId) },
  ];
  const ready = canCompleteMission({
    promptSubmitted,
    answerReceived,
    followUpSubmitted,
    reasonablenessChosen: Boolean(selectedId),
  });

  return (
    <div className="space-y-4">
      <ol className="space-y-3">
        {checks.map((check) => (
          <li key={check.label} className="flex items-start justify-between gap-4 rounded-xl border-2 border-ink bg-surface px-4 py-3">
            <span className="leading-relaxed">{check.label}</span>
            <span className="shrink-0 font-bold">{check.done ? "Done" : "Still to do"}</span>
          </li>
        ))}
      </ol>
      <h2 className="text-2xl font-bold">{activity.question}</h2>
      <div className="space-y-3">
        {activity.options.map((option) => (
          <ChoiceButton
            key={option.id}
            pressed={selectedId === option.id}
            marker={selectedId === option.id ? "Selected" : undefined}
            onClick={() => onChoose(option.id)}
          >
            {option.label}
          </ChoiceButton>
        ))}
      </div>
      {selectedId && ready ? (
        <FeedbackBanner tone="neutral" title="No wrong answer">
          <Multiline text={activity.feedback} />
        </FeedbackBanner>
      ) : null}
      {selectedId && !ready ? (
        <FeedbackBanner tone="incorrect" title="Not quite">
          Go back and finish the question, the answer, and one follow-up before this mission can be completed.
        </FeedbackBanner>
      ) : null}
    </div>
  );
}
