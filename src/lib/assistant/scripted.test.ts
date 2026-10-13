import { describe, expect, it } from "vitest";
import { scriptedAssistant } from "@/lib/assistant/scripted";

describe("practice assistant", () => {
  it("answers the moon-phase question and three follow-ups", () => {
    const reply = scriptedAssistant.reply({
      prompt: "Why does the moon change shape?",
      topicId: "science",
    });
    expect(reply.id).toBe("moon");
    expect(reply.text).toContain("phases of the Moon");
    expect(scriptedAssistant.followUp({ replyId: reply.id, kind: "simpler" })).toContain("round ball");
    expect(scriptedAssistant.followUp({ replyId: reply.id, kind: "example" })).toContain("crescent");
    expect(scriptedAssistant.followUp({ replyId: reply.id, kind: "surprising" })).toContain("29.5");
  });

  it("matches the other prepared lesson examples", () => {
    expect(scriptedAssistant.reply({ prompt: "Give me three easy pasta recipes." }).id).toBe("pasta");
    expect(scriptedAssistant.reply({ prompt: "Teach me something interesting about Boston." }).id).toBe(
      "boston",
    );
    expect(
      scriptedAssistant.reply({ prompt: "What are some beginner watercolor techniques?" }).id,
    ).toBe("watercolor");
    expect(scriptedAssistant.reply({ prompt: "Explain how rainbows form." }).id).toBe("rainbow");
    expect(scriptedAssistant.reply({ prompt: "Give me three dinner ideas." }).id).toBe("dinner");
    expect(scriptedAssistant.reply({ prompt: "Help me write a thank-you note." }).id).toBe("thanks");
  });

  it("does not invent an answer for an unsupported prompt", () => {
    const reply = scriptedAssistant.reply({
      prompt: "What is my bank account balance?",
      topicId: "other",
    });
    expect(reply.id).toBe("fallback");
    expect(reply.text).toContain("prepared answers");
    expect(reply.text).toContain("can't see your files");
    expect(scriptedAssistant.followUp({ replyId: reply.id, kind: "surprising", topicId: "other" })).toContain(
      "does not search the internet",
    );
  });
});
