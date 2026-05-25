"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/components/AuthProvider";
import { getMyProgress } from "@/lib/api";
import type { Progress } from "@/types/progress";

type ProgressLoadState = "idle" | "loading" | "ready" | "error";

export default function ProgressPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loadState, setLoadState] = useState<ProgressLoadState>("idle");

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      return;
    }

    let ignore = false;

    async function loadProgress() {
      setLoadState("loading");

      try {
        const loadedProgress = await getMyProgress();

        if (!ignore) {
          setProgress(loadedProgress);
          setLoadState("ready");
        }
      } catch {
        if (!ignore) {
          setProgress(null);
          setLoadState("error");
        }
      }
    }

    loadProgress();

    return () => {
      ignore = true;
    };
  }, [isAuthLoading, isAuthenticated]);

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <SiteHeader active="progress" />
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
            Progress
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-stone-950">
            Your progress
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            Review saved attempts, completed exercises, and your current answer
            accuracy.
          </p>
        </div>

        {isAuthLoading ? <ProgressMessage title="Loading progress" /> : null}

        {!isAuthLoading && !isAuthenticated ? (
          <ProgressMessage
            title="Log in to view and save your progress."
            detail="Practice is available without an account, but saved progress requires a session."
            actionHref="/login"
            actionLabel="Log in"
          />
        ) : null}

        {isAuthenticated && loadState === "loading" ? (
          <ProgressMessage title="Loading progress" />
        ) : null}

        {isAuthenticated && loadState === "error" ? (
          <ProgressMessage
            title="Unable to load progress"
            detail="The backend may be unavailable. Try again once the API is running."
          />
        ) : null}

        {isAuthenticated && loadState === "ready" && progress ? (
          progress.total_attempts === 0 ? (
            <ProgressMessage
              title="No attempts yet. Start practicing to build your progress."
              detail="Your correct answers and completed exercises will appear here."
              actionHref="/practice"
              actionLabel="Start practicing"
            />
          ) : (
            <ProgressDashboard progress={progress} />
          )
        ) : null}
      </div>
    </main>
  );
}

function ProgressDashboard({ progress }: { progress: Progress }) {
  const successRate = Math.round(progress.success_rate * 100);
  const completedCount = progress.completed_exercise_ids.length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProgressStat label="Total attempts" value={progress.total_attempts} />
        <ProgressStat label="Correct attempts" value={progress.correct_attempts} />
        <ProgressStat label="Success rate" value={`${successRate}%`} />
        <ProgressStat label="Completed" value={completedCount} />
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_18px_60px_rgba(41,37,36,0.08)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              Completed exercises
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-stone-950">
              Exercise IDs
            </h2>
          </div>
          <Link
            href="/practice"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-stone-200 bg-white px-4 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-100"
          >
            Practice
          </Link>
        </div>

        {progress.completed_exercise_ids.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {progress.completed_exercise_ids.map((exerciseId) => (
              <span
                key={exerciseId}
                className="rounded-full border border-[#008080]/20 bg-[#008080]/10 px-3 py-1 text-sm font-medium text-[#008080]"
              >
                #{exerciseId}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-stone-600">
            No completed exercises yet. Correct answers will appear here.
          </p>
        )}
      </section>
    </div>
  );
}

function ProgressStat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-normal text-stone-950">
        {value}
      </p>
    </div>
  );
}

function ProgressMessage({
  title,
  detail,
  actionHref,
  actionLabel,
}: {
  title: string;
  detail?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white px-5 py-10 text-center shadow-[0_18px_60px_rgba(41,37,36,0.08)]">
      <p className="font-medium text-stone-950">{title}</p>
      {detail ? <p className="mt-2 text-sm text-stone-500">{detail}</p> : null}
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-[#008080] px-5 text-sm font-medium text-white transition hover:bg-[#006666]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
