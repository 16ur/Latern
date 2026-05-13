import { ExercisePractice } from "@/components/ExercisePractice";
import { SiteHeader } from "@/components/SiteHeader";

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <SiteHeader active="practice" />
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">Practice</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-stone-950 sm:text-4xl">
              LaTeX workshop
            </h1>
          </div>
        </div>
        <ExercisePractice />
      </div>
    </main>
  );
}
