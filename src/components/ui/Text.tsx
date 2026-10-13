const EMOJI = /\p{Extended_Pictographic}\uFE0F?/u;

export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\p{Extended_Pictographic}\uFE0F?)/u).filter(Boolean);
  return (
    <>
      {parts.map((part, index) =>
        EMOJI.test(part) ? (
          <span key={index} aria-hidden="true">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export function Multiline({ text, className = "" }: { text: string; className?: string }) {
  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  return (
    <div className={`space-y-3 ${className}`}>
      {lines.map((line, index) => (
        <p key={index} className="leading-relaxed">
          {line}
        </p>
      ))}
    </div>
  );
}
