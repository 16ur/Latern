"use client";

import { useEffect, useMemo, useState } from "react";

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
  const domains = useMemo(
    () => Array.from(new Set(exercises.map((exercise) => exercise.domain))),
    [exercises],
  );

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
              className="mt-2 min-h-24 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm leading-6 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
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
              className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
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

          {domains.length > 0 ? (
            <p className="text-xs text-stone-500">
              Available domains: {domains.join(", ")}
            </p>
          ) : null}
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
  title
}: {
  currentIndex: number;
  total: number;
  completedCount: number;
  domain?: string;
  difficulty?: number;
  title?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-stone-950 sm:text-3xl">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span className="rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-700">
            {domain ?? "Practice"}
          </span>
          {difficulty ? <span>Level {difficulty}</span> : null}
        </div>
      </div>
      <div className="text-right text-xs text-stone-500">
        <p>
          {total > 0 ? currentIndex + 1 : 0} / {total}
        </p>
        <p className="mt-1 text-emerald-700">{completedCount} completed</p>
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
