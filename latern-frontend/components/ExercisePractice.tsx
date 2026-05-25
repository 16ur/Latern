"use client";

import { useEffect, useState } from "react";

import { listExercises, submitExerciseAttempt } from "@/lib/api";
import type { Exercise, ExerciseAttempt } from "@/types/exercise";
import { LatexPreview } from "@/components/LatexPreview";

type LoadState = "idle" | "loading" | "ready" | "empty" | "error";

export function ExercisePractice() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [attempt, setAttempt] = useState<ExerciseAttempt | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadExercises() {
      setLoadState("loading");

      try {
        const loadedExercises = await listExercises();

        if (ignore) {
          return;
        }

        setExercises(loadedExercises);
        setLoadState(loadedExercises.length > 0 ? "ready" : "empty");
      } catch {
        if (!ignore) {
          setLoadState("error");
        }
      }
    }

    loadExercises();

    return () => {
      ignore = true;
    };
  }, []);

  const currentExercise = exercises[currentIndex];
  async function handleSubmit() {
    if (!currentExercise || !answer.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitExerciseAttempt(currentExercise.id, answer);
      setAttempt(result);

      if (result.correct) {
        setCompletedCount((count) => count + 1);
      }
    } catch {
      setSubmitError("Unable to check your answer right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function goToNextExercise() {
    setCurrentIndex((index) => (index + 1) % exercises.length);
    setAnswer("");
    setAttempt(null);
    setSubmitError(null);
  }

  return (
    <section
      id="practice"
      className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_18px_60px_rgba(41,37,36,0.08)] sm:p-7"
    >
      <PracticeHeader
        currentIndex={currentIndex}
        total={exercises.length}
        completedCount={completedCount}
        domain={currentExercise?.domain}
        difficulty={currentExercise?.difficulty}
        title={currentExercise?.title}
      />

      {loadState === "loading" || loadState === "idle" ? (
        <PracticeMessage title="Loading exercises" />
      ) : null}

      {loadState === "error" ? (
        <PracticeMessage
          title="Backend unavailable"
          detail="Start the Django backend on http://localhost:8000 or set NEXT_PUBLIC_API_BASE_URL."
        />
      ) : null}

      {loadState === "empty" ? (
        <PracticeMessage
          title="No active exercises"
          detail="Add active exercises from the Django admin to get started."
        />
      ) : null}

      {loadState === "ready" && currentExercise ? (
        <div className="mt-7 space-y-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              Type this in LaTeX
            </p>
            <div className="mt-2 rounded-xl bg-stone-100 px-4 py-8">
              <LatexPreview latex={currentExercise.prompt_latex} />
            </div>
          </div>


          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              Live render
            </p>
            <div className="mt-2">
              <LatexPreview latex={answer} />
            </div>
          </div>
          
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              Your LaTeX
            </span>
            <textarea
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value);
                setAttempt(null);
                setSubmitError(null);
              }}
              className="mt-2 min-h-24 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm leading-6 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-[#008080] focus:bg-white focus:ring-4 focus:ring-[#008080]/10"
              spellCheck={false}
            />
          </label>



          <HintList hints={currentExercise.hints} />

          {attempt ? (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                attempt.correct
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              {attempt.correct
                ? "Correct. You can move to the next exercise."
                : "Not yet. Compare the render and adjust your syntax."}
            </div>
          ) : null}

          {submitError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              {submitError}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !answer.trim()}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[#008080] px-5 text-sm font-medium text-white transition hover:bg-[#006666] disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {isSubmitting ? "Checking..." : "Check answer"}
            </button>
            <button
              type="button"
              onClick={goToNextExercise}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-stone-200 bg-white px-5 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-100"
            >
              Next exercise
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function PracticeHeader({
  currentIndex,
  total,
  completedCount,
  domain,
  difficulty,
  title,
}: {
  currentIndex: number;
  total: number;
  completedCount: number;
  domain?: string;
  difficulty?: number;
  title?: string;
}) {
  const currentPosition = total > 0 ? currentIndex + 1 : 0;
  const progressValue = total > 0 ? Math.round((currentPosition / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="rounded-full bg-[#008080]/10 px-3 py-1 text-[#008080]">
              Practice session
            </span>
            <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-stone-600">
              {domain ?? "General"}
            </span>
            {difficulty ? (
              <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-stone-600">
                Level {difficulty}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-normal text-stone-950 sm:text-4xl">
            {title ?? "Choose an exercise"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Match the target expression, compare the render, and move forward
            once your syntax is precise.
          </p>
        </div>

        <div className="w-full rounded-2xl border border-stone-200 bg-white p-4 shadow-sm lg:w-64">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                Exercise
              </p>
              <p className="mt-1 text-2xl font-semibold text-stone-950">
                {currentPosition}
                <span className="ml-1 text-base font-medium text-stone-400">
                  / {total}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                Completed
              </p>
              <p className="mt-1 text-lg font-semibold text-[#008080]">
                {completedCount}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 rounded-full bg-stone-100">
            <div
              className="h-2 rounded-full bg-[#008080] transition-[width]"
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-stone-500">
            {progressValue}% through the loaded set
          </p>
        </div>
      </div>
    </div>
  );
}

function PracticeMessage({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="mt-7 rounded-xl border border-stone-200 bg-stone-50 px-4 py-8 text-center">
      <p className="font-medium text-stone-950">{title}</p>
      {detail ? <p className="mt-2 text-sm text-stone-500">{detail}</p> : null}
    </div>
  );
}

function HintList({ hints }: { hints: string[] }) {
  if (hints.length === 0) {
    return null;
  }

  return (
    <details className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
      <summary className="cursor-pointer font-medium text-stone-800">
        Show a hint
      </summary>
      <ul className="mt-3 space-y-2">
        {hints.map((hint) => (
          <li key={hint}>{hint}</li>
        ))}
      </ul>
    </details>
  );
}
