export type TextSize = "default" | "large" | "extra";

export type SkillProgress = {
  name: string;
  percent: number;
};

export type Choice = {
  id: string;
  label: string;
  icon?: string;
};

export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "examples"; items: { icon: string; text: string }[] }
  | { type: "cards"; items: { icon: string; title: string; body: string }[] }
  | { type: "term"; text: string }
  | { type: "labeled"; items: { label: string; text: string }[] }
  | {
      type: "comparison";
      traditional: { title: string; rows: { label: string; text: string }[] };
      generative: { title: string; rows: { label: string; text: string }[] };
    }
  | {
      type: "anatomy";
      sentence: string;
      parts: { text: string; meaning: string }[];
      lesson: string;
    }
  | { type: "note"; text: string }
  | { type: "steps"; items: string[] };

export type MultipleChoiceActivity = {
  type: "multiple-choice";
  question: string;
  options: Choice[];
  correctId: string;
  explanation: string;
};

export type TapToIdentifyActivity = {
  type: "tap-to-identify";
  instruction: string;
  options: Choice[];
  correctIds: string[];
  correctFeedback: string;
  incorrectFeedback: string;
  presentation: "list" | "phone";
};

export type Scenario = {
  id: string;
  prompt: string;
  correctId: string;
  feedback: string;
};

export type ScenarioActivity = {
  type: "scenario";
  instruction: string;
  choices: Choice[];
  scenarios: Scenario[];
};

export type ReflectionActivity = {
  type: "reflection";
  question: string;
  options: Choice[];
  feedback?: string;
  feedbackByOption?: Record<string, string>;
};

export type SafetyActivity = {
  type: "safety";
};

export type PracticeChatActivity = {
  type: "practice-chat";
  greeting: string;
  suggestions: {
    id: string;
    label: string;
    action: "fill" | "focus";
    prompt?: string;
  }[];
};

export type TopicChoiceActivity = {
  type: "topic-choice";
  question: string;
  options: Choice[];
  otherId: string;
};

export type FreeResponseActivity = {
  type: "free-response";
  instruction: string;
  examples: string[];
  buttonLabel: string;
};

export type AiResponseActivity = {
  type: "ai-response";
};

export type FollowUpKind = "simpler" | "example" | "surprising";

export type FollowUpActivity = {
  type: "follow-up";
  actions: { kind: FollowUpKind; label: string }[];
};

export type MissionActivity = {
  type: "mission";
  scenario: string;
  steps: string[];
  question: string;
  options: Choice[];
  feedback: string;
};

/**
 * Reserved for a later unit. Unit 1 does not render this activity.
 * Example buckets: Safe, Think First, Don't Share.
 */
export type SortingActivity = {
  type: "sorting";
  buckets: string[];
};

export type Activity =
  | MultipleChoiceActivity
  | TapToIdentifyActivity
  | ScenarioActivity
  | ReflectionActivity
  | SafetyActivity
  | PracticeChatActivity
  | TopicChoiceActivity
  | FreeResponseActivity
  | AiResponseActivity
  | FollowUpActivity
  | MissionActivity;

export type ContentScreen = {
  kind: "content";
  id: string;
  blocks: ContentBlock[];
  activity?: Activity;
  forwardLabel?: string;
};

export type CompletionScreen = {
  kind: "completion";
  id: string;
  heading: string;
  paragraphs: string[];
  learned?: string[];
  skill?: SkillProgress;
  forwardLabel: string;
  nextLessonId?: string;
};

export type Screen = ContentScreen | CompletionScreen;

export type Lesson = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  minutes: number;
  skills: string[];
  screens: Screen[];
};

export function screenHeading(screen: Screen): string {
  if (screen.kind === "completion") return screen.heading;
  const heading = screen.blocks.find((block) => block.type === "heading");
  if (heading && heading.type === "heading") return heading.text;
  const activity = screen.activity;
  if (!activity) return screen.id;
  if ("question" in activity && activity.question) return activity.question;
  if (activity.type === "scenario") return activity.instruction;
  return screen.id;
}

export function activityQuestionIsHeading(screen: ContentScreen): boolean {
  return !screen.blocks.some((block) => block.type === "heading");
}
