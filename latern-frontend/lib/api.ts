import type { Exercise, ExerciseAttempt } from "@/types/exercise";
import type { AuthSuccess, User } from "@/types/auth";
import type { Progress } from "@/types/progress";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

type ApiErrorBody = {
  detail?: string;
};

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === "object" && value !== null && "detail" in value;
}

async function readErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const body: unknown = await response.json();

    if (
      isApiErrorBody(body) &&
      typeof body.detail === "string" &&
      body.detail.trim()
    ) {
      return body.detail;
    }
  } catch {
    // Use the supplied fallback when the response body is empty or not JSON.
  }

  return fallback;
}

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
    const message = await readErrorMessage(
      response,
      `API request failed with status ${response.status}`,
    );
    throw new Error(message);
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

export function loginUser(payload: {
  username: string;
  password: string;
}): Promise<AuthSuccess> {
  return request<AuthSuccess>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerUser(payload: {
  username: string;
  email?: string;
  password: string;
}): Promise<User> {
  return request<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logoutUser(): Promise<AuthSuccess> {
  return request<AuthSuccess>("/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    const message = await readErrorMessage(
      response,
      "Unable to restore your session.",
    );
    throw new Error(message);
  }

  return response.json() as Promise<User>;
}

export async function getMyProgress(): Promise<Progress> {
  const response = await fetch(`${API_BASE_URL}/me/progress`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    throw new Error("Authentication required");
  }

  if (!response.ok) {
    throw new Error("Unable to load progress right now.");
  }

  return response.json() as Promise<Progress>;
}
