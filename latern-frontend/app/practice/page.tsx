import { ExercisePractice } from "@/components/ExercisePractice";
import { SiteHeader } from "@/components/SiteHeader";

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <SiteHeader active="practice" />
      <div className="mx-auto w-full max-w-7xl px-5 py-4 sm:px-8 sm:py-6 lg:py-6">
        <ExercisePractice />
      </div>
    </main>
  );
}
