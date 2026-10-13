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
        <Link
          href="/"
          className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-navy bg-navy px-4 py-3 font-bold text-white sm:max-w-xs"
        >
          Back to Unit 1
        </Link>
      </main>
    </>
  );
}
