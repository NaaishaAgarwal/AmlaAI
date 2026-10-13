import { fallbackReply, replyById } from "@/lib/assistant/responses";
import type { AssistantProvider, AssistantReply } from "@/lib/assistant/types";

export function normalizePrompt(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const matchers: { id: string; test: (text: string) => boolean }[] = [
  {
    id: "moon",
    test: (text) =>
      /\bmoon\b/.test(text) &&
      /\b(shape|shapes|phase|phases|change|changes|changing|crescent|full)\b/.test(
        text,
      ),
  },
  { id: "rainbow", test: (text) => /\brainbows?\b/.test(text) },
  {
    id: "pasta",
    test: (text) =>
      /\bpasta\b/.test(text) &&
      /\b(recipe|recipes|cook|cooking|easy|idea|ideas|make)\b/.test(text),
  },
  { id: "boston", test: (text) => /\bboston\b/.test(text) },
  {
    id: "watercolor",
    test: (text) => /\b(watercolor|watercolour)\b/.test(text) || text.includes("water color"),
  },
  {
    id: "thanks",
    test: (text) =>
      text.includes("thank") && /\b(note|write|writing|letter)\b/.test(text),
  },
  {
    id: "dinner",
    test: (text) =>
      /\bdinner\b/.test(text) && /\b(idea|ideas|plan|meal|meals|three)\b/.test(text),
  },
];

export function matchReply(prompt: string, topicId?: string): AssistantReply {
  const text = normalizePrompt(prompt);
  const match = matchers.find((matcher) => matcher.test(text));
  if (!match) return fallbackReply(topicId);
  return replyById(match.id, topicId);
}

export const scriptedAssistant: AssistantProvider = {
  reply({ prompt, topicId }) {
    return matchReply(prompt, topicId);
  },
  followUp({ replyId, kind, topicId }) {
    return replyById(replyId, topicId).followUps[kind];
  },
};
