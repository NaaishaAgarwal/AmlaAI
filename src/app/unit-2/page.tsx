import Link from "next/link";
import { AppHeader } from "@/components/ui/AppHeader";

export default function UnitTwoPage() {
  return (
    <>
      <AppHeader />
      <main id="main" className="mx-auto w-full max-w-[40rem] px-5 py-8">
        <p className="font-bold text-navy">Unit 2</p>
        <h1 className="mt-2 text-4xl font-bold leading-tight">Unit 2 is coming later.</h1>
        <p className="mt-4 leading-relaxed">
          In the next unit, you&apos;ll learn how to ask AI better questions and get more useful answers.
        </p>
        <p className="mt-4 leading-relaxed">
          This unit is not ready yet. You can return home and review Unit 1 anytime.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-navy bg-navy px-4 py-3 font-bold text-white hover:bg-navy-strong"
          >
            Back home
          </Link>
          <Link
            href="/unit-1"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-ink bg-surface px-4 py-3 font-bold text-ink"
          >
            Review Unit 1
          </Link>
        </div>
      </main>
    </>
  );
}
