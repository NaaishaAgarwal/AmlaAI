import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MultipleChoice } from "@/components/lesson/MultipleChoice";
import { TapToIdentify } from "@/components/lesson/TapToIdentify";
import type { MultipleChoiceActivity, TapToIdentifyActivity } from "@/content/types";

const quiz: MultipleChoiceActivity = {
  type: "multiple-choice",
  question: "Which statement is closest to what AI is?",
  options: [
    { id: "a", label: "AI is a type of robot." },
    { id: "b", label: "AI is technology that can perform tasks." },
  ],
  correctId: "b",
  explanation: "Exactly!\nAI is a broad category of technology.",
};

const tap: TapToIdentifyActivity = {
  type: "tap-to-identify",
  presentation: "list",
  instruction: "Tap the examples that could involve AI.",
  options: [
    { id: "face", label: "A phone recognizing your face" },
    { id: "calculator", label: "A calculator adding numbers" },
    { id: "music", label: "A music app recommending a song" },
  ],
  correctIds: ["face", "music"],
  correctFeedback: "Great job!\nAI can be used when technology is recognizing patterns.",
  incorrectFeedback: "Almost!\nNot every smart-looking piece of technology uses AI.",
};

describe("graded activities", () => {
  it("shows the supplied explanation only after the correct choice", () => {
    render(
      <MultipleChoice activity={quiz} heading onAttempt={() => undefined} onResolve={() => undefined} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "AI is a type of robot." }));
    expect(screen.getByRole("status").textContent).toContain("Not quite");
    expect(screen.queryByText(/Exactly!/)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "AI is technology that can perform tasks." }));
    expect(screen.getByRole("status").textContent).toContain("Exactly!");
    expect(screen.getByRole("status").textContent).toContain("Correct");
  });

  it("shows the supplied tap feedback for a wrong set and a right set", () => {
    render(<TapToIdentify activity={tap} onAttempt={() => undefined} onResolve={() => undefined} />);
    fireEvent.click(screen.getByRole("button", { name: /calculator/i }));
    fireEvent.click(screen.getByRole("button", { name: "Check answers" }));
    expect(screen.getByRole("status").textContent).toContain("Almost!");

    fireEvent.click(screen.getByRole("button", { name: /calculator/i }));
    fireEvent.click(screen.getByRole("button", { name: /phone recognizing/i }));
    fireEvent.click(screen.getByRole("button", { name: /music app/i }));
    fireEvent.click(screen.getByRole("button", { name: "Check answers" }));
    expect(screen.getByRole("status").textContent).toContain("Great job!");
  });
});
