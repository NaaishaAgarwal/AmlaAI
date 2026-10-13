import type { Lesson } from "@/content/types";

export const lesson3: Lesson = {
  id: "U1-L3",
  number: 3,
  title: "What Is Generative AI?",
  subtitle: "AI that can create.",
  minutes: 6,
  skills: ["Generative AI", "AI assistants", "Understanding AI outputs"],
  screens: [
    {
      kind: "content",
      id: "opening",
      blocks: [
        {
          type: "heading",
          text: "Some AI doesn't just recognize things. It creates things.",
        },
        {
          type: "paragraph",
          text: "Imagine showing an AI a photograph and asking:",
        },
        { type: "callout", text: '"What is in this picture?"' },
        { type: "paragraph", text: "That's one kind of AI task." },
        { type: "paragraph", text: "Now imagine asking:" },
        {
          type: "callout",
          text: '"Create a story about a dog who travels to the moon."',
        },
        { type: "paragraph", text: "The AI can generate new text." },
        { type: "paragraph", text: "That's called generative AI." },
      ],
    },
    {
      kind: "content",
      id: "definition",
      blocks: [
        { type: "heading", text: "Generative AI" },
        {
          type: "paragraph",
          text: "Generative AI is AI that can create new content based on the instructions you give it.",
        },
        { type: "paragraph", text: "It can generate things such as:" },
        {
          type: "examples",
          items: [
            { icon: "📝", text: "Text" },
            { icon: "🖼️", text: "Images" },
            { icon: "🎵", text: "Audio" },
            { icon: "🎬", text: "Video" },
          ],
        },
        {
          type: "callout",
          text: '"Generative" means creating or producing something new.',
        },
      ],
    },
    {
      kind: "content",
      id: "compare",
      blocks: [
        { type: "heading", text: "Traditional AI and generative AI" },
        {
          type: "comparison",
          traditional: {
            title: "Traditional AI task",
            rows: [
              { label: "Input", text: "A photo of a dog." },
              { label: "Question", text: '"What is in this picture?"' },
              { label: "Possible output", text: '"There\'s a dog in the picture."' },
            ],
          },
          generative: {
            title: "Generative AI task",
            rows: [
              {
                label: "Instruction",
                text: '"Write a funny story about a dog who wants to become a chef."',
              },
              { label: "Output", text: "A newly generated story." },
            ],
          },
        },
      ],
    },
    {
      kind: "content",
      id: "game",
      blocks: [],
      activity: {
        type: "multiple-choice",
        question: "Which request is an example of generative AI?",
        options: [
          { id: "a", label: '"Is there a dog in this photo?"' },
          { id: "b", label: '"Does this email look like spam?"' },
          { id: "c", label: '"Write a birthday message for my grandson."' },
          { id: "d", label: '"How many steps did I walk today?"' },
        ],
        correctId: "c",
        explanation: "Correct!\nThe AI is being asked to create new text.",
      },
    },
    {
      kind: "content",
      id: "many-things",
      blocks: [
        { type: "heading", text: "What can generative AI create?" },
        {
          type: "cards",
          items: [
            {
              icon: "📝",
              title: "Text",
              body: "Emails, stories, explanations, lists",
            },
            {
              icon: "🖼️",
              title: "Images",
              body: "Pictures, illustrations, designs",
            },
            { icon: "🎵", title: "Audio", body: "Speech, music, sound" },
            { icon: "🎬", title: "Video", body: "Clips and animations" },
          ],
        },
        {
          type: "note",
          text: "The exact abilities depend on the AI tool. Not every AI assistant can create every type of content.",
        },
      ],
    },
    {
      kind: "content",
      id: "warning",
      blocks: [
        { type: "heading", text: "Created doesn't mean correct." },
        {
          type: "paragraph",
          text: "Generative AI can create something that sounds convincing.",
        },
        {
          type: "paragraph",
          text: "But convincing does not always mean accurate.",
        },
        {
          type: "paragraph",
          text: "For example, an AI might confidently give you an incorrect historical fact.",
        },
        {
          type: "paragraph",
          text: "That's why one of the most important AI skills is:",
        },
        { type: "steps", items: ["Learn", "Ask", "Check"] },
        { type: "paragraph", text: "We'll practice this more later." },
        { type: "callout", text: "AI can be useful without being perfect." },
      ],
    },
    {
      kind: "content",
      id: "reflection",
      blocks: [],
      activity: {
        type: "reflection",
        question: "What would you most enjoy asking generative AI to create?",
        options: [
          { id: "story", label: "A story" },
          { id: "email", label: "An email" },
          { id: "recipe", label: "A recipe" },
          { id: "picture", label: "A picture" },
          { id: "travel", label: "A travel plan" },
          { id: "other", label: "Something else" },
        ],
      },
    },
    {
      kind: "completion",
      id: "complete",
      heading: "You've unlocked Generative AI! ✨",
      paragraphs: [
        "You now understand the difference between AI that can recognize or predict something and generative AI that can create new content.",
      ],
      skill: { name: "Generative AI", percent: 60 },
      forwardLabel: "Next Lesson",
      nextLessonId: "U1-L4",
    },
  ],
};
