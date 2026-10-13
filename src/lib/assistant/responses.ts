import type { FollowUpKind } from "@/content/types";
import type { AssistantReply } from "@/lib/assistant/types";

export const topicExamples: Record<string, string> = {
  science: "Why does the moon change shape?",
  history: "Teach me something interesting about Boston.",
  food: "Give me three easy pasta recipes.",
  travel: "Teach me something interesting about Boston.",
  hobbies: "What are some beginner watercolor techniques?",
  other: "Why does the moon change shape?",
};

export function exampleForTopic(topicId?: string): string {
  if (!topicId) return topicExamples.science;
  return topicExamples[topicId] ?? topicExamples.other;
}

const fallbackFollowUps = (example: string): Record<FollowUpKind, string> => ({
  simpler: `I can only expand answers I already have. A prepared question I can answer is: ${example}`,
  example: `For example, if you ask “${example}” I can give a prepared answer. I can't look up a new topic.`,
  surprising:
    "This practice assistant does not search the internet or your personal files. Its answers were written ahead of time for this lesson.",
});

export function fallbackReply(topicId?: string): AssistantReply {
  const example = exampleForTopic(topicId);
  return {
    id: "fallback",
    text: `I'm a practice assistant with prepared answers, so I can't look this up or answer every question. I also can't see your files or personal information. Try one of the example questions, such as “${example}”`,
    followUps: fallbackFollowUps(example),
  };
}

export const preparedReplies: AssistantReply[] = [
  {
    id: "moon",
    text: "The Moon doesn't actually change shape. We see different amounts of its sunlit side as it travels around Earth. These different views are called phases of the Moon.",
    followUps: {
      simpler:
        "The Moon is always a round ball. The Sun lights one side of it. As the Moon travels around Earth, we see more or less of that bright side. That is why it looks different from night to night.",
      example:
        "A crescent moon looks like a sliver of light. A full moon is when we can see the whole bright side. Those are two of the Moon's phases.",
      surprising:
        "The Moon goes through its phases in about 29.5 days. The far side of the Moon is not always dark. It gets sunlight too. We call it the far side because it faces away from Earth.",
    },
  },
  {
    id: "rainbow",
    text: "Rainbows appear when sunlight passes through water droplets in the air. The droplets bend the light and spread it into colors.",
    followUps: {
      simpler:
        "Sunlight goes into a raindrop, bends, and comes back out as colors. You usually see a rainbow when the sun is behind you and rain is in front of you.",
      example:
        "You can see a small rainbow in the mist from a garden hose on a sunny day, if the sun is behind you.",
      surprising:
        "A rainbow is not a physical object in the sky. It is light reaching your eyes from many raindrops, so two people standing apart see it in slightly different places.",
    },
  },
  {
    id: "pasta",
    text: "Here are three easy pasta ideas. First, pasta with butter and grated cheese. Second, pasta with olive oil, garlic, and a pinch of salt. Third, pasta with a simple tomato and garlic sauce. Boil the pasta in salted water, then mix it with one of these toppings.",
    followUps: {
      simpler:
        "Cook the pasta in boiling water with a little salt. Drain it. Then stir in butter and cheese, or olive oil and garlic, or a simple tomato sauce.",
      example:
        "For butter and cheese pasta, boil the pasta, drain it, and stir in a spoonful of butter and a handful of grated cheese. Add a little salt if you want.",
      surprising:
        "Salting the cooking water seasons the pasta itself. Adding salt only at the table does not do the same job, because the pasta has already absorbed the water.",
    },
  },
  {
    id: "boston",
    text: "Boston is the capital of Massachusetts. A famous walk there is the Freedom Trail, which passes historic sites from the American Revolution. Boston also sits on a harbor.",
    followUps: {
      simpler:
        "Boston is a city in Massachusetts. It is the state capital. People visit it for its harbor and for historic places from the American Revolution.",
      example:
        "The Freedom Trail is a walking path marked by a red line. It connects places such as the Massachusetts State House and Paul Revere's house.",
      surprising:
        "Boston is one of the oldest cities in the United States. The city was founded in 1630.",
    },
  },
  {
    id: "watercolor",
    text: "A good place to start with watercolor is two basic methods. Wet-on-dry means painting on dry paper, which gives clearer edges. Wet-on-wet means painting onto damp paper, which lets colors blend softly. Begin with light colors. You can add darker color later, but it is hard to make a dark wash light again.",
    followUps: {
      simpler:
        "Start with a little water and light paint. Paint on dry paper for sharper shapes. Paint on damp paper when you want soft blends.",
      example:
        "Try a sky: wet the paper, then touch in a little blue. The color will spread softly. That is wet-on-wet.",
      surprising:
        "Watercolor often looks darker when it is wet. It dries lighter, so painters usually use a little more color than the final picture needs.",
    },
  },
  {
    id: "dinner",
    text: "Here are three simple dinner ideas. Baked chicken with rice and a vegetable. Bean soup with bread. Eggs with toast and a salad. Choose the one that fits the food you already have.",
    followUps: {
      simpler:
        "Pick one main food, such as chicken, beans, or eggs. Add a vegetable or salad, and add bread or rice if you want.",
      example:
        "A bean soup dinner can be a can of bean soup heated on the stove, plus toast and a piece of fruit.",
      surprising:
        "You do not need a complicated recipe to make a satisfying plate. A protein, a vegetable, and a starch is a reliable pattern.",
    },
  },
  {
    id: "thanks",
    text: "Here is a short thank-you note you can adapt. Dear [Name], Thank you for [what they did]. It meant a lot to me. With thanks, [Your name]",
    followUps: {
      simpler:
        "Write who you are thanking, what they did, and why it mattered. Then sign your name.",
      example:
        "Dear Sam, Thank you for the ride to my appointment. It made a hard day much easier. With thanks, Alex.",
      surprising:
        "A short, specific note is often more meaningful than a long one. Naming the exact kindness is the most important part.",
    },
  },
];

export function replyById(id: string, topicId?: string): AssistantReply {
  return preparedReplies.find((reply) => reply.id === id) ?? fallbackReply(topicId);
}
