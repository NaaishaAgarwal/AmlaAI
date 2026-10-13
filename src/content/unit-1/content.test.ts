import { describe, expect, it } from "vitest";
import { screenHeading } from "@/content/types";
import { unit1 } from "@/content/unit-1";

const expectedHeadings = [
  [
    "What exactly is AI?",
    "So, what is AI?",
    "AI doesn't always look like AI.",
    "Which statement is closest to what AI is?",
    "Before today, had you ever used something powered by AI?",
    "You met AI! 🎉",
  ],
  [
    "You might already know AI.",
    "Where might AI be hiding?",
    "Look at how much AI can do!",
    "Is AI likely involved?",
    'AI is not the same as "smart technology."',
    "Which example surprised you most?",
    "AI Detective: Level 1 complete 🔎",
  ],
  [
    "Some AI doesn't just recognize things. It creates things.",
    "Generative AI",
    "Traditional AI and generative AI",
    "Which request is an example of generative AI?",
    "What can generative AI create?",
    "Created doesn't mean correct.",
    "What would you most enjoy asking generative AI to create?",
    "You've unlocked Generative AI! ✨",
  ],
  [
    "You've heard of ChatGPT. But what actually happens when you use it?",
    "A prompt is your instruction to AI.",
    "Anatomy of a simple prompt",
    "Which prompt is clearer?",
    "One important thing before you start",
    "Practice assistant",
    "Which statement is true?",
    "You met your AI assistant! 🤝",
  ],
  [
    "Ready to try it yourself?",
    "What are you curious about?",
    "Ask your AI assistant",
    "Your practice assistant replied",
    "Take a look at the answer.",
    "You don't have to stop after one answer.",
    "🎯 Your First AI Mission",
    "How do you feel about AI now?",
  ],
];

describe("Unit 1 curriculum", () => {
  it("includes five lessons in order", () => {
    expect(unit1.lessons.map((lesson) => lesson.id)).toEqual([
      "U1-L1",
      "U1-L2",
      "U1-L3",
      "U1-L4",
      "U1-L5",
    ]);
  });

  it("keeps every screen heading", () => {
    unit1.lessons.forEach((lesson, index) => {
      expect(lesson.screens.map(screenHeading)).toEqual(expectedHeadings[index]);
    });
  });

  it("keeps the answer keys", () => {
    const lesson1Quiz = unit1.lessons[0].screens[3];
    const lesson1Tap = unit1.lessons[0].screens[1];
    const lesson2Tap = unit1.lessons[1].screens[1];
    const lesson2Scenarios = unit1.lessons[1].screens[3];
    const lesson3Quiz = unit1.lessons[2].screens[3];
    const clearer = unit1.lessons[3].screens[3];
    const quick = unit1.lessons[3].screens[6];
    const noticed = unit1.lessons[4].screens[4];

    expect(lesson1Quiz.kind === "content" && lesson1Quiz.activity).toBeTruthy();
    if (lesson1Quiz.kind === "content" && lesson1Quiz.activity?.type === "multiple-choice") {
      expect(lesson1Quiz.activity.correctId).toBe("b");
    }
    if (lesson1Tap.kind === "content" && lesson1Tap.activity?.type === "tap-to-identify") {
      expect(lesson1Tap.activity.correctIds).toEqual(["face", "music", "spam"]);
    }
    if (lesson2Tap.kind === "content" && lesson2Tap.activity?.type === "tap-to-identify") {
      expect(lesson2Tap.activity.correctIds).toEqual([
        "photos",
        "email",
        "maps",
        "music",
        "shopping",
      ]);
    }
    if (lesson2Scenarios.kind === "content" && lesson2Scenarios.activity?.type === "scenario") {
      expect(lesson2Scenarios.activity.scenarios.map((item) => item.correctId)).toEqual([
        "likely",
        "not",
        "likely",
        "not",
      ]);
    }
    if (lesson3Quiz.kind === "content" && lesson3Quiz.activity?.type === "multiple-choice") {
      expect(lesson3Quiz.activity.correctId).toBe("c");
    }
    if (clearer.kind === "content" && clearer.activity?.type === "multiple-choice") {
      expect(clearer.activity.correctId).toBe("b");
    }
    if (quick.kind === "content" && quick.activity?.type === "multiple-choice") {
      expect(quick.activity.correctId).toBe("c");
    }
    if (noticed.kind === "content" && noticed.activity?.type === "multiple-choice") {
      expect(noticed.activity.correctId).toBe("a");
    }
  });

  it("shows the safety screen before the practice chat", () => {
    const screens = unit1.lessons[3].screens;
    const safety = screens.findIndex(
      (screen) => screen.kind === "content" && screen.activity?.type === "safety",
    );
    const chat = screens.findIndex(
      (screen) => screen.kind === "content" && screen.activity?.type === "practice-chat",
    );
    expect(safety).toBeGreaterThan(-1);
    expect(chat).toBeGreaterThan(safety);
  });
});
