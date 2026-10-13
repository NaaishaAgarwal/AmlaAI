import type { ContentBlock } from "@/content/types";
import { Callout, Note } from "@/components/ui/Feedback";
import { RichText } from "@/components/ui/Text";

export function BlockView({ blocks }: { blocks: ContentBlock[] }) {
  const firstHeading = blocks.findIndex((block) => block.type === "heading");

  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const isFirst = index === firstHeading;
          const Tag = isFirst ? "h1" : "h2";
          return (
            <Tag
              key={index}
              id={isFirst ? "screen-heading" : undefined}
              tabIndex={isFirst ? -1 : undefined}
              className="text-3xl font-bold leading-tight outline-none"
            >
              <RichText text={block.text} />
            </Tag>
          );
        }
        if (block.type === "paragraph") {
          return (
            <p key={index} className="leading-relaxed">
              {block.text}
            </p>
          );
        }
        if (block.type === "bullets") {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6 leading-relaxed">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "callout") return <Callout key={index} text={block.text} />;
        if (block.type === "note") return <Note key={index} text={block.text} />;
        if (block.type === "term") {
          return (
            <p key={index} className="text-3xl font-bold text-navy">
              {block.text}
            </p>
          );
        }
        if (block.type === "examples") {
          return (
            <ul key={index} className="space-y-3">
              {block.items.map((item) => (
                <li
                  key={item.text}
                  className="flex items-start gap-3 rounded-xl border-2 border-ink bg-surface px-4 py-3"
                >
                  <span aria-hidden="true" className="text-2xl leading-none">
                    {item.icon}
                  </span>
                  <span className="font-semibold leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "cards") {
          return (
            <ul key={index} className="grid gap-4 sm:grid-cols-2">
              {block.items.map((item) => (
                <li key={item.title} className="rounded-xl border-2 border-ink bg-surface p-4">
                  <h2 className="text-2xl font-bold">
                    <span aria-hidden="true">{item.icon} </span>
                    {item.title}
                  </h2>
                  <p className="mt-2 leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "labeled") {
          return (
            <dl key={index} className="space-y-3">
              {block.items.map((item) => (
                <div key={item.label} className="rounded-xl border-2 border-ink bg-surface p-4">
                  <dt className="font-bold">{item.label}</dt>
                  <dd className="mt-1 leading-relaxed">{item.text}</dd>
                </div>
              ))}
            </dl>
          );
        }
        if (block.type === "comparison") {
          return (
            <div key={index} className="grid gap-4 md:grid-cols-2">
              {[block.traditional, block.generative].map((column) => (
                <article key={column.title} className="rounded-xl border-2 border-ink bg-surface p-4">
                  <h2 className="text-2xl font-bold">{column.title}</h2>
                  <dl className="mt-4 space-y-3">
                    {column.rows.map((row) => (
                      <div key={row.label}>
                        <dt className="font-bold">{row.label}</dt>
                        <dd className="leading-relaxed">{row.text}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          );
        }
        if (block.type === "anatomy") {
          return (
            <div key={index} className="space-y-4">
              <p className="rounded-xl border-2 border-navy bg-white p-4 text-xl font-bold leading-relaxed">
                “{block.sentence}”
              </p>
              <ul className="space-y-3">
                {block.parts.map((part) => (
                  <li key={part.text} className="rounded-xl border-2 border-ink bg-surface p-4">
                    <p className="text-xl font-bold">{part.text}</p>
                    <p className="mt-1 leading-relaxed">{part.meaning}</p>
                  </li>
                ))}
              </ul>
              {block.lesson.split("\n").map((line) => (
                <p key={line} className="leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          );
        }
        if (block.type === "steps") {
          return (
            <ol key={index} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {block.items.map((item, stepIndex) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="inline-flex min-h-14 min-w-14 items-center justify-center rounded-xl border-2 border-ink bg-white px-4 font-bold">
                    {item}
                  </span>
                  {stepIndex < block.items.length - 1 ? (
                    <span aria-hidden="true" className="hidden text-2xl sm:inline">
                      →
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          );
        }
        return null;
      })}
    </div>
  );
}

export function blocksIncludeHeading(blocks: ContentBlock[]) {
  return blocks.some((block) => block.type === "heading");
}
