import type { SkillProgress } from "@/content/types";
import { lesson1 } from "@/content/unit-1/lesson-1";
import { lesson2 } from "@/content/unit-1/lesson-2";
import { lesson3 } from "@/content/unit-1/lesson-3";
import { lesson4 } from "@/content/unit-1/lesson-4";
import { lesson5 } from "@/content/unit-1/lesson-5";

export const unit1Lessons = [lesson1, lesson2, lesson3, lesson4, lesson5];

export const unit1 = {
  id: "U1",
  title: "Meet AI",
  purpose:
    "Unit 1 introduces learners to artificial intelligence in a friendly, non-technical way.",
  promise:
    "I understand what AI is, I recognize where I encounter it, and I feel comfortable trying it.",
  minutes: "About 25–35 minutes",
  challengeId: "U1-L5-mission",
  lessons: unit1Lessons,
  learned: [
    "What AI is",
    "Where AI appears in everyday life",
    "What generative AI is",
    "What a prompt is",
    "How to talk to an AI assistant",
    "Why AI answers should not automatically be trusted",
  ],
  skills: [
    { name: "AI Basics", percent: 100 },
    { name: "AI Awareness", percent: 100 },
    { name: "Generative AI", percent: 100 },
    { name: "AI Interaction", percent: 100 },
  ] satisfies SkillProgress[],
  badge: {
    name: "AI Explorer",
    description:
      "You've taken your first steps toward understanding and using artificial intelligence.",
  },
  finalMessage: [
    "You don't need to be a technology expert to use AI.",
    "You just need to be curious, willing to experiment, and ready to learn.",
    "In the next unit, you'll learn how to ask AI better questions and get more useful answers.",
  ],
};

export function lessonById(lessonId: string) {
  return unit1Lessons.find((lesson) => lesson.id === lessonId);
}

export function lessonIndex(lessonId: string) {
  return unit1Lessons.findIndex((lesson) => lesson.id === lessonId);
}
