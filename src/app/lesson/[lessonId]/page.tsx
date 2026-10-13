import { Suspense } from "react";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";

export default function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ screen?: string | string[] }>;
}) {
  return (
    <Suspense fallback={<p className="px-5 py-8 text-xl">Loading lesson…</p>}>
      <LessonPlayer params={params} searchParams={searchParams} />
    </Suspense>
  );
}
