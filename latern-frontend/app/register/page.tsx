"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/components/AuthProvider";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message.trim()
    ? error.message
    : fallback;
}

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password) {
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await register(username.trim(), email.trim() || undefined, password);
      router.push("/login?registered=1");
    } catch (registerError) {
      setError(
        getErrorMessage(registerError, "Unable to create an account right now."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-md flex-col px-5 py-12 sm:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(41,37,36,0.08)] sm:p-7">
          {isLoading ? (
            <AuthMessage title="Checking session" />
          ) : isAuthenticated ? (
            <AuthMessage
              title="You are already logged in."
              detail="Continue to practice with progress saving enabled."
              actionHref="/practice"
              actionLabel="Go to practice"
            />
          ) : (
            <>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                  Create account
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-normal text-stone-950">
                  Sign up
                </h1>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Create an account to save correct attempts and resume your
                  progression later.
                </p>
              </div>

              {error ? (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                    Username
                  </span>
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-[#008080] focus:bg-white focus:ring-4 focus:ring-[#008080]/10"
                    autoComplete="username"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                    Email optional
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-[#008080] focus:bg-white focus:ring-4 focus:ring-[#008080]/10"
                    autoComplete="email"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                    Password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-[#008080] focus:bg-white focus:ring-4 focus:ring-[#008080]/10"
                    autoComplete="new-password"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                    Confirm password
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-[#008080] focus:bg-white focus:ring-4 focus:ring-[#008080]/10"
                    autoComplete="new-password"
                  />
                </label>

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !username.trim() ||
                    !password ||
                    !confirmPassword
                  }
                  className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#008080] px-5 text-sm font-medium text-white transition hover:bg-[#006666] disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="mt-5 text-sm text-stone-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-[#008080] hover:text-[#006666]"
                >
                  Log in
                </Link>
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function AuthMessage({
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
    <div className="text-center">
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
    </div>
  );
}
