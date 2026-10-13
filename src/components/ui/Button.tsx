import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

const styles: Record<Variant, string> = {
  primary: "border-navy bg-navy text-white hover:bg-navy-strong",
  secondary: "border-ink bg-surface text-ink hover:bg-paper",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-14 w-full items-center justify-center rounded-xl border-2 px-4 py-3 text-center text-base font-bold leading-snug disabled:cursor-not-allowed disabled:opacity-55 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ChoiceButton({
  pressed = false,
  marker,
  children,
  onClick,
  disabled,
}: {
  pressed?: boolean;
  marker?: string;
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-14 w-full items-center justify-between gap-4 rounded-xl border-2 border-ink bg-surface px-4 py-3 text-left text-base font-semibold leading-snug hover:bg-paper disabled:cursor-not-allowed ${pressed ? "bg-paper ring-4 ring-navy" : ""}`}
    >
      <span>{children}</span>
      {marker ? <span className="shrink-0 font-bold">{marker}</span> : null}
    </button>
  );
}
