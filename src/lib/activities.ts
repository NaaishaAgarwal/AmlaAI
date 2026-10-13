export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function isPromptAcceptable(text: string): boolean {
  return wordCount(text) >= 2;
}

export function setsMatch(selected: string[], correct: string[]): boolean {
  if (selected.length !== correct.length) return false;
  const chosen = new Set(selected);
  return correct.every((id) => chosen.has(id));
}

export function canCompleteMission(input: {
  promptSubmitted: boolean;
  answerReceived: boolean;
  followUpSubmitted: boolean;
  reasonablenessChosen: boolean;
}): boolean {
  return (
    input.promptSubmitted &&
    input.answerReceived &&
    input.followUpSubmitted &&
    input.reasonablenessChosen
  );
}
