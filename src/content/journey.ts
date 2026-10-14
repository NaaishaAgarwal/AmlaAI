export type JourneyUnit = {
  id: string;
  number: number;
  title: string;
  description: string;
  available: boolean;
};

export const journeyUnits: JourneyUnit[] = [
  {
    id: "U1",
    number: 1,
    title: "Meet AI",
    description:
      "Introduction to artificial intelligence, everyday AI, generative AI, AI assistants, prompts, and your first AI conversation.",
    available: true,
  },
  {
    id: "U2",
    number: 2,
    title: "Ask Better Questions",
    description: "Learn to write clearer prompts and get more useful answers from AI.",
    available: false,
  },
  {
    id: "U3",
    number: 3,
    title: "Use AI in Everyday Life",
    description:
      "Explore practical uses of AI for writing, planning, learning, and organizing information.",
    available: false,
  },
  {
    id: "U4",
    number: 4,
    title: "Think Critically About AI",
    description:
      "Practice evaluating AI responses, recognizing possible mistakes, verifying information, and protecting your privacy.",
    available: false,
  },
  {
    id: "U5",
    number: 5,
    title: "Make AI Work for You",
    description:
      "Apply what you have learned through practical activities and a final real-world challenge.",
    available: false,
  },
];
