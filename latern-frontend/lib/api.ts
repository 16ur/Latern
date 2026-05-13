import type { Exercise, ExerciseAttempt } from "@/types/exercise";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function listExercises() {
  return request<Exercise[]>("/exercises");
}

export function submitExerciseAttempt(exerciseId: number, answer: string) {
  return request<ExerciseAttempt>(`/exercises/${exerciseId}/attempt`, {
    method: "POST",
    body: JSON.stringify({ answer }),
  });
}
