"use client";

import { useEffect, useState } from "react";

import { listExercises, submitExerciseAttempt } from "@/lib/api";
import type { Exercise, ExerciseAttempt } from "@/types/exercise";
import { useAuth } from "@/components/AuthProvider";
import { LatexPreview } from "@/components/LatexPreview";

type LoadState = "idle" | "loading" | "ready" | "empty" | "error";

export function ExercisePractice() {
  const { isAuthenticated, isLoading } = useAuth();
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
      className="rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_18px_60px_rgba(41,37,36,0.08)] sm:p-5"
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
        <div className="mx-auto mt-4 max-w-4xl space-y-4">
          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                Type this in LaTeX
              </p>
              <HintList hints={currentExercise.hints} />
            </div>
            <div className="mt-2 rounded-xl bg-stone-100 px-3 py-4">
              <LatexPreview compact latex={currentExercise.prompt_latex} />
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
            <div className="space-y-4">
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
                  className="mt-2 h-28 w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 font-mono text-sm leading-6 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-[#008080] focus:ring-4 focus:ring-[#008080]/10"
                  spellCheck={false}
                />
              </label>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                  Live render
                </p>
                <div className="mt-2">
                  <LatexPreview compact latex={answer} />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-h-11 flex-1">
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
              </div>

              <div className="sticky bottom-3 grid grid-cols-2 gap-3 rounded-xl bg-stone-50/95 p-1 backdrop-blur sm:static sm:min-w-72 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !answer.trim()}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-[#008080] px-4 text-sm font-medium text-white transition hover:bg-[#006666] disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  {isSubmitting ? "Checking..." : "Check answer"}
                </button>
                <button
                  type="button"
                  onClick={goToNextExercise}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-stone-200 bg-white px-4 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-100"
                >
                  Next
                </button>
              </div>
            </div>

            {!isAuthenticated && !isLoading ? (
              <p className="mt-3 text-xs text-stone-500">
                You can practice freely. Log in to save correct attempts.
              </p>
            ) : null}
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
    <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-3 sm:p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
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

            <h1 className="mt-3 truncate text-2xl font-semibold tracking-normal text-stone-950 sm:text-3xl">
              {title ?? "Choose an exercise"}
            </h1>
          </div>

          <div className="flex w-full items-center justify-between gap-3 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-600 shadow-sm lg:w-auto lg:min-w-72">
            <span className="font-medium text-stone-950">
              Exercise {currentPosition}
              <span className="font-normal text-stone-400"> / {total}</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
            <span>
              <span className="font-semibold text-[#008080]">
                {completedCount}
              </span>{" "}
              completed
            </span>
          </div>
        </div>

        <div>
          <div className="h-2 rounded-full bg-stone-100">
            <div
              className="h-2 rounded-full bg-[#008080] transition-[width]"
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-stone-500">
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
