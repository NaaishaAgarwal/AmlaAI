import type { Lesson } from "@/content/types";

const machineLearningNote =
  "Many apps in these categories use AI or machine-learning features (a way computers find patterns in examples), although the exact technology depends on the app.";

export const lesson2: Lesson = {
  id: "U1-L2",
  number: 2,
  title: "AI Is Already Around You",
  subtitle: "You may know AI better than you think.",
  minutes: 6,
  skills: ["AI recognition", "Everyday technology", "AI awareness"],
  screens: [
    {
      kind: "content",
      id: "opening",
      blocks: [
        { type: "heading", text: "You might already know AI." },
        {
          type: "paragraph",
          text: "Imagine waking up tomorrow and trying to avoid every technology that uses AI.",
        },
        { type: "paragraph", text: "You open your phone." },
        { type: "paragraph", text: "You check your email." },
        { type: "paragraph", text: "You look at your photos." },
        { type: "paragraph", text: "You open a music app." },
        { type: "paragraph", text: "You check the weather." },
        { type: "paragraph", text: "You search for a restaurant." },
        {
          type: "paragraph",
          text: "You might encounter AI in several of those places.",
        },
        { type: "paragraph", text: "Let's find out where." },
      ],
    },
    {
      kind: "content",
      id: "find-the-ai",
      blocks: [
        { type: "heading", text: "Where might AI be hiding?" },
        { type: "note", text: machineLearningNote },
      ],
      activity: {
        type: "tap-to-identify",
        presentation: "phone",
        instruction: "Tap the apps where AI might be involved.",
        options: [
          { id: "photos", label: "Photos", icon: "📷" },
          { id: "email", label: "Email", icon: "📧" },
          { id: "maps", label: "Maps", icon: "🗺️" },
          { id: "music", label: "Music", icon: "🎵" },
          { id: "weather", label: "Weather", icon: "🌤️" },
          { id: "calculator", label: "Calculator", icon: "🔢" },
          { id: "messages", label: "Messages", icon: "💬" },
          { id: "shopping", label: "Shopping", icon: "🛒" },
        ],
        correctIds: ["photos", "email", "maps", "music", "shopping"],
        correctFeedback: `Great job!\nThese are the apps counted in this activity.\n${machineLearningNote}`,
        incorrectFeedback: `Not quite.\n${machineLearningNote}`,
      },
    },
    {
      kind: "content",
      id: "reveal",
      blocks: [
        { type: "heading", text: "Look at how much AI can do!" },
        {
          type: "cards",
          items: [
            {
              icon: "📷",
              title: "Photos",
              body: "AI can help recognize people, objects, or scenes.",
            },
            {
              icon: "📧",
              title: "Email",
              body: "AI can help identify suspicious messages or organize information.",
            },
            {
              icon: "🗺️",
              title: "Maps",
              body: "AI and related predictive systems can help estimate traffic and travel times.",
            },
            {
              icon: "🎵",
              title: "Music",
              body: "AI-based recommendation systems can help predict what you might enjoy.",
            },
            {
              icon: "🛒",
              title: "Shopping",
              body: "Recommendation systems can suggest products based on patterns in your activity.",
            },
          ],
        },
        { type: "note", text: machineLearningNote },
        { type: "callout", text: "AI often works quietly in the background." },
      ],
    },
    {
      kind: "content",
      id: "ai-or-not",
      blocks: [],
      activity: {
        type: "scenario",
        instruction: "Is AI likely involved?",
        choices: [
          { id: "likely", label: "AI likely involved" },
          { id: "not", label: "AI is not necessary" },
        ],
        scenarios: [
          {
            id: "face",
            prompt: "Your phone recognizes your face and unlocks.",
            correctId: "likely",
            feedback: "Correct!",
          },
          {
            id: "calculator",
            prompt: "A calculator adds 25 + 37.",
            correctId: "not",
            feedback:
              "Right.\nA calculator can perform this task using straightforward mathematical instructions.",
          },
          {
            id: "music",
            prompt: "A music app recommends a song you might enjoy.",
            correctId: "likely",
            feedback:
              "Correct!\nRecommendation systems can use patterns in data to predict what someone might like.",
          },
          {
            id: "switch",
            prompt: "You flip a physical light switch.",
            correctId: "not",
            feedback:
              "Correct!\nThe light can simply respond to the switch being turned on.",
          },
        ],
      },
    },
    {
      kind: "content",
      id: "smart-technology",
      blocks: [
        { type: "heading", text: 'AI is not the same as "smart technology."' },
        {
          type: "paragraph",
          text: "Some technology can do complicated things without using AI.",
        },
        {
          type: "paragraph",
          text: "Other technology uses AI quietly in the background.",
        },
        { type: "paragraph", text: "So instead of asking:" },
        { type: "callout", text: '"Does this look intelligent?"' },
        { type: "paragraph", text: "Ask:" },
        {
          type: "callout",
          text: '"Is the technology recognizing patterns, making predictions, understanding language, or generating something?"',
        },
      ],
    },
    {
      kind: "content",
      id: "reflection",
      blocks: [],
      activity: {
        type: "reflection",
        question: "Which example surprised you most?",
        options: [
          { id: "photos", label: "Photos", icon: "📷" },
          { id: "email", label: "Email", icon: "📧" },
          { id: "maps", label: "Maps", icon: "🗺️" },
          { id: "music", label: "Music", icon: "🎵" },
          { id: "shopping", label: "Shopping", icon: "🛒" },
          { id: "none", label: "None surprised me" },
        ],
        feedback:
          "That's the point!\nAI is already part of many everyday technologies.",
      },
    },
    {
      kind: "completion",
      id: "complete",
      heading: "AI Detective: Level 1 complete 🔎",
      paragraphs: [
        "You can now start recognizing AI in the technology around you.",
      ],
      skill: { name: "AI Awareness", percent: 40 },
      forwardLabel: "Next Lesson",
      nextLessonId: "U1-L3",
    },
  ],
};
