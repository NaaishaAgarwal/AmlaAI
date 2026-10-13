import type { FollowUpKind } from "@/content/types";

export type AssistantReply = {
  id: string;
  text: string;
  followUps: Record<FollowUpKind, string>;
};

export type AssistantProvider = {
  reply(input: { prompt: string; topicId?: string }): AssistantReply;
  followUp(input: {
    replyId: string;
    kind: FollowUpKind;
    topicId?: string;
  }): string;
};
