import type { Lesson } from "@/content/types";

export const lesson4: Lesson = {
  id: "U1-L4",
  number: 4,
  title: "Meet Your AI Assistant",
  subtitle: "Let's see what happens when you talk to AI.",
  minutes: 7,
  skills: [
    "AI assistants",
    "Prompts",
    "AI interaction",
    "Understanding limitations",
  ],
  screens: [
    {
      kind: "content",
      id: "opening",
      blocks: [
        {
          type: "heading",
          text: "You've heard of ChatGPT. But what actually happens when you use it?",
        },
        {
          type: "paragraph",
          text: "An AI assistant lets you communicate with AI using everyday language.",
        },
        { type: "paragraph", text: "You don't need to know how to program." },
        { type: "paragraph", text: "You simply tell it what you want." },
        { type: "paragraph", text: "That instruction is called a:" },
        { type: "term", text: "Prompt" },
      ],
    },
    {
      kind: "content",
      id: "what-is-a-prompt",
      blocks: [
        { type: "heading", text: "A prompt is your instruction to AI." },
        {
          type: "examples",
          items: [
            { icon: "💬", text: '"Explain how rainbows form."' },
            { icon: "💬", text: '"Give me three dinner ideas."' },
            { icon: "💬", text: '"Help me write a thank-you note."' },
            { icon: "💬", text: '"Explain this word in simple language."' },
          ],
        },
        {
          type: "callout",
          text: "You don't need special computer language.\nYou can communicate with an AI assistant much like you would explain something to another person.",
        },
      ],
    },
    {
      kind: "content",
      id: "anatomy",
      blocks: [
        { type: "heading", text: "Anatomy of a simple prompt" },
        {
          type: "anatomy",
          sentence: "Explain how a rainbow forms in simple language.",
          parts: [
            { text: "Explain", meaning: "What you want AI to do" },
            { text: "How a rainbow forms", meaning: "The topic" },
            { text: "In simple language", meaning: "How you want the answer" },
          ],
          lesson:
            "A good prompt doesn't have to be complicated.\nIt just needs to communicate what you want.",
        },
      ],
    },
    {
      kind: "content",
      id: "clearer-prompt",
      blocks: [],
      activity: {
        type: "multiple-choice",
        question: "Which prompt is clearer?",
        options: [
          { id: "a", label: '"Travel."' },
          {
            id: "b",
            label: '"Give me three ideas for a weekend trip to Boston."',
          },
        ],
        correctId: "b",
        explanation:
          "Exactly.\nThe second prompt tells the AI what you want it to do.\nIn the next unit, you'll learn how to make prompts even better.",
      },
    },
    {
      kind: "content",
      id: "safety",
      forwardLabel: "I understand",
      blocks: [
        { type: "heading", text: "One important thing before you start" },
        { type: "paragraph", text: "AI assistants are useful, but remember:" },
        {
          type: "bullets",
          items: [
            "AI is not a person.",
            "It does not automatically know everything.",
            "It can make mistakes.",
            "And you should think carefully before sharing private or sensitive information.",
          ],
        },
        { type: "callout", text: "When in doubt, don't share it." },
      ],
      activity: { type: "safety" },
    },
    {
      kind: "content",
      id: "practice-chat",
      blocks: [{ type: "heading", text: "Practice assistant" }],
      activity: {
        type: "practice-chat",
        greeting:
          "Hello! I'm your practice AI assistant.\n\nTry asking me a question.",
        suggestions: [
          {
            id: "explain",
            label: "Explain something",
            action: "fill",
            prompt: "Explain how rainbows form.",
          },
          {
            id: "plan",
            label: "Help me plan",
            action: "fill",
            prompt: "Give me three dinner ideas.",
          },
          {
            id: "write",
            label: "Write something",
            action: "fill",
            prompt: "Help me write a thank-you note.",
          },
          { id: "curious", label: "I'm curious about...", action: "focus" },
        ],
      },
    },
    {
      kind: "content",
      id: "quick-check",
      blocks: [],
      activity: {
        type: "multiple-choice",
        question: "Which statement is true?",
        options: [
          { id: "a", label: "AI assistants are always correct." },
          { id: "b", label: "AI assistants only understand computer code." },
          { id: "c", label: "AI assistants can respond to everyday language." },
          {
            id: "d",
            label: "You should give AI every personal detail so it can help you.",
          },
        ],
        correctId: "c",
        explanation:
          "Correct!\nYou can communicate with many AI assistants using normal language.\nBut AI can make mistakes, and you should protect your personal information.",
      },
    },
    {
      kind: "completion",
      id: "complete",
      heading: "You met your AI assistant! 🤝",
      paragraphs: ["You now know:"],
      learned: [
        "what a prompt is",
        "how to give an AI an instruction",
        "that AI can respond to everyday language",
        "that AI can make mistakes",
      ],
      skill: { name: "AI Interaction", percent: 80 },
      forwardLabel: "Final Lesson",
      nextLessonId: "U1-L5",
    },
  ],
};
