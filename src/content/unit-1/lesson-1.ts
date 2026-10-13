import type { Lesson } from "@/content/types";

export const lesson1: Lesson = {
  id: "U1-L1",
  number: 1,
  title: "What Is AI?",
  subtitle: "Let's start with the big question.",
  minutes: 5,
  skills: ["AI basics", "Recognizing AI", "Understanding technology"],
  screens: [
    {
      kind: "content",
      id: "welcome",
      forwardLabel: "Let's learn",
      blocks: [
        { type: "heading", text: "What exactly is AI?" },
        {
          type: "paragraph",
          text: 'You have probably heard the words "artificial intelligence" everywhere.',
        },
        { type: "paragraph", text: "Maybe you've seen AI in the news." },
        { type: "paragraph", text: "Maybe someone has told you about ChatGPT." },
        { type: "paragraph", text: "Maybe you have never used AI at all." },
        { type: "paragraph", text: "That's completely okay." },
        { type: "paragraph", text: "Let's start with the basics." },
      ],
    },
    {
      kind: "content",
      id: "definition",
      blocks: [
        { type: "heading", text: "So, what is AI?" },
        {
          type: "paragraph",
          text: "Artificial intelligence, or AI, is technology that can perform tasks that normally require some form of human intelligence.",
        },
        { type: "paragraph", text: "For example, AI can help computers:" },
        {
          type: "bullets",
          items: [
            "recognize patterns",
            "understand language",
            "recognize images",
            "make predictions",
            "recommend things",
            "create text, images, and other content",
          ],
        },
        {
          type: "callout",
          text: "AI is a tool.\nIt is not a human.\nIt does not think and understand the world exactly the way you do.",
        },
      ],
      activity: {
        type: "tap-to-identify",
        presentation: "list",
        instruction: "Tap the examples that could involve AI.",
        options: [
          { id: "face", label: "A phone recognizing your face" },
          { id: "calculator", label: "A calculator adding numbers" },
          { id: "music", label: "A music app recommending a song" },
          { id: "spam", label: "A spam filter identifying suspicious email" },
          { id: "light", label: "A light switch turning a lamp on" },
        ],
        correctIds: ["face", "music", "spam"],
        correctFeedback:
          "Great job!\nAI can be used when technology is recognizing patterns, making predictions, or deciding what information may be useful.",
        incorrectFeedback:
          "Almost!\nNot every smart-looking piece of technology uses AI.\nA simple calculator, for example, can follow mathematical instructions without needing AI.",
      },
    },
    {
      kind: "content",
      id: "not-a-robot",
      blocks: [
        { type: "heading", text: "AI doesn't always look like AI." },
        {
          type: "paragraph",
          text: "When people imagine AI, they sometimes picture a robot walking around and talking.",
        },
        { type: "paragraph", text: "But most AI is much less dramatic." },
        {
          type: "paragraph",
          text: "It may be quietly working inside an app or device you already use.",
        },
        {
          type: "examples",
          items: [
            { icon: "📱", text: "Your phone recognizing your face" },
            { icon: "🎵", text: "A music app recommending songs" },
            { icon: "📧", text: "An email service filtering spam" },
            { icon: "🗺️", text: "A map app predicting traffic" },
            { icon: "📷", text: "A photo app recognizing people or objects" },
          ],
        },
        {
          type: "callout",
          text: "You may have already used AI without realizing it.",
        },
      ],
    },
    {
      kind: "content",
      id: "quick-check",
      blocks: [],
      activity: {
        type: "multiple-choice",
        question: "Which statement is closest to what AI is?",
        options: [
          { id: "a", label: "AI is a type of robot." },
          {
            id: "b",
            label:
              "AI is technology that can perform tasks involving abilities such as recognizing patterns, understanding language, or making predictions.",
          },
          { id: "c", label: "AI is another name for the internet." },
          { id: "d", label: "AI is a computer that never makes mistakes." },
        ],
        correctId: "b",
        explanation:
          "Exactly!\nAI is a broad category of technology.\nIt can appear in many different forms—from a recommendation system to an AI assistant.\nAnd importantly, AI can make mistakes.\nWe'll learn more about that later.",
      },
    },
    {
      kind: "content",
      id: "reflection",
      blocks: [],
      activity: {
        type: "reflection",
        question: "Before today, had you ever used something powered by AI?",
        options: [
          { id: "knew", label: "Yes, I knew it was AI." },
          { id: "unaware", label: "Yes, but I didn't realize it was AI." },
          { id: "unsure", label: "I'm not sure." },
          { id: "probably-not", label: "Probably not." },
        ],
        feedback:
          "There is no wrong answer.\nThe point of this lesson is simply to start noticing where AI appears in everyday life.",
      },
    },
    {
      kind: "completion",
      id: "complete",
      heading: "You met AI! 🎉",
      paragraphs: [
        "You now know the basic idea:",
        "AI is technology that can perform tasks involving abilities such as recognizing patterns, understanding language, making predictions, or generating content.",
      ],
      skill: { name: "AI Basics", percent: 20 },
      forwardLabel: "Next Lesson",
      nextLessonId: "U1-L2",
    },
  ],
};
