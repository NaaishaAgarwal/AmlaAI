import type { Lesson } from "@/content/types";

export const lesson5: Lesson = {
  id: "U1-L5",
  number: 5,
  title: "Your First AI Conversation",
  subtitle: "Now it's your turn.",
  minutes: 7,
  skills: [
    "Asking AI questions",
    "Experimenting with prompts",
    "Evaluating AI responses",
    "Confidence",
  ],
  screens: [
    {
      kind: "content",
      id: "opening",
      blocks: [
        { type: "heading", text: "Ready to try it yourself?" },
        { type: "paragraph", text: "You've learned what AI is." },
        { type: "paragraph", text: "You've seen where AI appears." },
        { type: "paragraph", text: "You've learned about generative AI." },
        { type: "paragraph", text: "You've learned what prompts are." },
        {
          type: "paragraph",
          text: "Now you're going to have your first AI conversation.",
        },
        { type: "paragraph", text: "There is no perfect question." },
        { type: "paragraph", text: "Be curious." },
      ],
    },
    {
      kind: "content",
      id: "topic",
      blocks: [],
      activity: {
        type: "topic-choice",
        question: "What are you curious about?",
        otherId: "other",
        options: [
          { id: "science", label: "Science", icon: "🔬" },
          { id: "history", label: "History", icon: "🌎" },
          { id: "food", label: "Food", icon: "🍳" },
          { id: "travel", label: "Travel", icon: "✈️" },
          { id: "hobbies", label: "Hobbies", icon: "🎨" },
          { id: "other", label: "Something else", icon: "💡" },
        ],
      },
    },
    {
      kind: "content",
      id: "prompt",
      forwardLabel: "Ask AI",
      blocks: [
        { type: "heading", text: "Ask your AI assistant" },
        {
          type: "paragraph",
          text: "Write a question or request about your topic.",
        },
      ],
      activity: {
        type: "free-response",
        instruction: "Write a question or request about your topic.",
        examples: [
          "Why does the moon change shape?",
          "Give me three easy pasta recipes.",
          "Teach me something interesting about Boston.",
          "What are some beginner watercolor techniques?",
        ],
        buttonLabel: "Ask AI",
      },
    },
    {
      kind: "content",
      id: "response",
      blocks: [{ type: "heading", text: "Your practice assistant replied" }],
      activity: { type: "ai-response" },
    },
    {
      kind: "content",
      id: "did-you-notice",
      blocks: [{ type: "heading", text: "Take a look at the answer." }],
      activity: {
        type: "multiple-choice",
        question: "What did the AI do?",
        options: [
          { id: "a", label: "It answered your question." },
          { id: "b", label: "It searched your personal files." },
          { id: "c", label: "It read your mind." },
          {
            id: "d",
            label: "It guaranteed that everything it said was correct.",
          },
        ],
        correctId: "a",
        explanation:
          "Exactly.\nYou gave the AI an instruction, and it generated a response.\nBut remember:\nAn AI answer is not automatically guaranteed to be correct.",
      },
    },
    {
      kind: "content",
      id: "follow-up",
      blocks: [
        { type: "heading", text: "You don't have to stop after one answer." },
        {
          type: "paragraph",
          text: "One of the most useful things about an AI assistant is that you can continue the conversation.",
        },
        { type: "paragraph", text: "Try:" },
        { type: "callout", text: '"Can you explain that more simply?"' },
        { type: "paragraph", text: "or:" },
        { type: "callout", text: '"Can you give me an example?"' },
        { type: "paragraph", text: "or:" },
        { type: "callout", text: '"Tell me more."' },
      ],
      activity: {
        type: "follow-up",
        actions: [
          { kind: "simpler", label: "Explain more simply" },
          { kind: "example", label: "Give me an example" },
          { kind: "surprising", label: "Tell me something surprising" },
        ],
      },
    },
    {
      kind: "content",
      id: "mission",
      blocks: [
        { type: "heading", text: "🎯 Your First AI Mission" },
        {
          type: "paragraph",
          text: "You are curious about a topic you've always wanted to learn more about.",
        },
        { type: "paragraph", text: "Your mission:" },
      ],
      activity: {
        type: "mission",
        scenario:
          "You are curious about a topic you've always wanted to learn more about.",
        steps: [
          "Ask AI a question.",
          "Read the answer.",
          "Ask one follow-up question.",
          "Decide whether the answer seems reasonable.",
        ],
        question: "Does this answer seem reasonable?",
        options: [
          { id: "reasonable", label: "It seems reasonable" },
          { id: "check", label: "I want to double-check it." },
        ],
        feedback:
          "That decision is yours.\nAn AI answer is not automatically guaranteed to be correct.",
      },
    },
    {
      kind: "content",
      id: "reflection",
      blocks: [],
      activity: {
        type: "reflection",
        question: "How do you feel about AI now?",
        options: [
          { id: "ready", label: "I'm ready to explore!" },
          { id: "basics", label: "I understand the basics." },
          { id: "unsure", label: "I'm still a little unsure." },
          { id: "practice", label: "I want more practice." },
        ],
        feedbackByOption: {
          ready: "Wonderful! You're ready for the next step.",
          basics: "Great! We'll build on them in Unit 2.",
          unsure: "That's okay. Learning something new takes practice.",
          practice: "That's exactly what the next units are for.",
        },
      },
    },
  ],
};
