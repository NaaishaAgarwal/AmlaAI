"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { FeedbackBanner } from "@/components/ui/Feedback";
import { Multiline } from "@/components/ui/Text";
import type { FollowUpKind, PracticeChatActivity } from "@/content/types";
import { isPromptAcceptable } from "@/lib/activities";
import { scriptedAssistant } from "@/lib/assistant/scripted";
import { readChat, writeChat, type ChatMessage } from "@/lib/chat-session";

export const PRACTICE_NOTE =
  "Prepared answers for this lesson. This is not a live AI service, and it cannot see your files or personal information.";

export function PracticeNote() {
  return <p className="rounded-xl border-2 border-navy bg-white px-4 py-3 leading-relaxed">{PRACTICE_NOTE}</p>;
}

export function ChatThread({ messages }: { messages: ChatMessage[] }) {
  if (messages.length === 0) return null;
  return (
    <ol className="space-y-3" aria-live="polite">
      {messages.map((message, index) => (
        <li
          key={index}
          className={`rounded-xl border-2 p-4 leading-relaxed ${message.role === "assistant" ? "border-navy bg-white" : "border-ink bg-surface"}`}
        >
          <p className="font-bold">{message.role === "assistant" ? "Practice assistant" : "You"}</p>
          <Multiline text={message.text} className="mt-2" />
        </li>
      ))}
    </ol>
  );
}

export function PracticeChat({
  lessonId,
  activity,
  onExchange,
}: {
  lessonId: string;
  activity: PracticeChatActivity;
  onExchange: () => void;
}) {
  const fieldId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    // The transcript is stored for this browser tab and is not available during server rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages(readChat(lessonId).messages);
  }, [lessonId]);

  function fill(prompt: string) {
    setDraft(prompt);
    setError(false);
    inputRef.current?.focus();
  }

  function send(event: FormEvent) {
    event.preventDefault();
    if (!isPromptAcceptable(draft)) {
      setError(true);
      return;
    }
    const reply = scriptedAssistant.reply({ prompt: draft });
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "learner", text: draft.trim() },
      { role: "assistant", text: reply.text },
    ];
    const existing = readChat(lessonId);
    writeChat(lessonId, {
      ...existing,
      messages: nextMessages,
      replyId: reply.id,
      promptSubmitted: true,
      answerReceived: true,
    });
    setMessages(nextMessages);
    setDraft("");
    setError(false);
    onExchange();
  }

  return (
    <div className="space-y-4">
      <PracticeNote />
      <div className="rounded-xl border-2 border-navy bg-white p-4">
        <p className="font-bold">Practice assistant</p>
        <Multiline text={activity.greeting} className="mt-2" />
      </div>
      <ChatThread messages={messages} />
      <div className="flex flex-col gap-3">
        {activity.suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            type="button"
            onClick={() => {
              if (suggestion.action === "focus") {
                inputRef.current?.focus();
                return;
              }
              if (suggestion.prompt) fill(suggestion.prompt);
            }}
            className="min-h-14 rounded-xl border-2 border-ink bg-surface px-4 py-3 text-left font-bold"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
      <form onSubmit={send} className="space-y-3">
        <label htmlFor={fieldId} className="block font-bold">
          Your question
        </label>
        <textarea
          id={fieldId}
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={4}
          className="w-full rounded-xl border-2 border-ink bg-white p-4 text-base leading-relaxed"
        />
        {error ? (
          <FeedbackBanner tone="incorrect" title="Not quite">
            Add a question or request, then try again.
          </FeedbackBanner>
        ) : null}
        <button
          type="submit"
          className="min-h-14 w-full rounded-xl border-2 border-navy bg-navy px-4 py-3 font-bold text-white"
        >
          Send question
        </button>
      </form>
    </div>
  );
}

export function FollowUpChat({
  lessonId,
  actions,
  onSent,
}: {
  lessonId: string;
  actions: { kind: FollowUpKind; label: string }[];
  onSent: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const session = readChat(lessonId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages(session.messages);
    setReplyId(session.replyId);
    setTopicId(session.topicId || undefined);
  }, [lessonId]);

  function ask(kind: FollowUpKind, label: string) {
    const id = replyId ?? "fallback";
    const text = scriptedAssistant.followUp({ replyId: id, kind, topicId });
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "learner", text: label },
      { role: "assistant", text },
    ];
    const existing = readChat(lessonId);
    writeChat(lessonId, {
      ...existing,
      messages: nextMessages,
      followUpSubmitted: true,
    });
    setMessages(nextMessages);
    onSent();
  }

  return (
    <div className="space-y-4">
      <PracticeNote />
      {messages.length === 0 ? (
        <p className="leading-relaxed">
          Your prepared answer is saved only in this browser tab. Go back and ask a question again.
        </p>
      ) : (
        <ChatThread messages={messages} />
      )}
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.kind}
            type="button"
            onClick={() => ask(action.kind, action.label)}
            className="min-h-14 w-full rounded-xl border-2 border-ink bg-surface px-4 py-3 text-left font-bold"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
