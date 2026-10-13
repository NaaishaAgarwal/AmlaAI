export type ChatRole = "learner" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  text: string;
};

export type ChatSession = {
  topicId: string;
  topicLabel: string;
  messages: ChatMessage[];
  replyId: string | null;
  promptSubmitted: boolean;
  answerReceived: boolean;
  followUpSubmitted: boolean;
};

export const CHAT_KEY = "meet-ai-chat-v1";

export function chatStorageKey(scope: string) {
  return `${CHAT_KEY}:${scope}`;
}

export function emptyChat(): ChatSession {
  return {
    topicId: "",
    topicLabel: "",
    messages: [],
    replyId: null,
    promptSubmitted: false,
    answerReceived: false,
    followUpSubmitted: false,
  };
}

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function browserSession(): StorageLike | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage;
}

export function readChat(scope: string, storage?: StorageLike | null): ChatSession {
  const source = storage === undefined ? browserSession() : storage;
  if (!source) return emptyChat();
  try {
    const raw = source.getItem(chatStorageKey(scope));
    if (!raw) return emptyChat();
    const parsed = JSON.parse(raw) as Partial<ChatSession>;
    return { ...emptyChat(), ...parsed, messages: parsed.messages ?? [] };
  } catch {
    return emptyChat();
  }
}

export function writeChat(
  scope: string,
  session: ChatSession,
  storage?: StorageLike | null,
) {
  const target = storage === undefined ? browserSession() : storage;
  target?.setItem(chatStorageKey(scope), JSON.stringify(session));
}

export function clearChat(scope: string, storage?: StorageLike | null) {
  const target = storage === undefined ? browserSession() : storage;
  target?.removeItem(chatStorageKey(scope));
}

export function clearAllChats(storage?: StorageLike | null) {
  clearChat("U1-L4", storage);
  clearChat("U1-L5", storage);
}
