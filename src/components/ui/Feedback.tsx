import type { ReactNode } from "react";
import { Multiline } from "@/components/ui/Text";

export function FeedbackBanner({
  tone,
  title,
  children,
}: {
  tone: "correct" | "incorrect" | "neutral";
  title: string;
  children: ReactNode;
}) {
  const styles = {
    correct: "border-correct bg-correct-bg text-correct",
    incorrect: "border-retry bg-retry-bg text-retry",
    neutral: "border-ink bg-surface text-ink",
  }[tone];
  const mark = tone === "correct" ? "✓" : tone === "incorrect" ? "✕" : "•";

  return (
    <div role="status" aria-live="polite" className={`rounded-xl border-2 p-4 ${styles}`}>
      <p className="text-lg font-bold">
        <span aria-hidden="true">{mark} </span>
        {title}
      </p>
      {typeof children === "string" ? (
        <Multiline text={children} className="mt-2" />
      ) : (
        <div className="mt-2 leading-relaxed">{children}</div>
      )}
    </div>
  );
}

export function Callout({ text }: { text: string }) {
  return (
    <aside className="rounded-xl border-2 border-navy bg-white px-4 py-4">
      <Multiline text={text} className="font-semibold" />
    </aside>
  );
}

export function Note({ text }: { text: string }) {
  return (
    <p className="rounded-xl border-2 border-dashed border-ink bg-white px-4 py-4 leading-relaxed">
      {text}
    </p>
  );
}
