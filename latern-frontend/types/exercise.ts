export type Exercise = {
  id: number;
  title: string;
  prompt_latex: string;
  hints: string[];
  difficulty: number;
  domain: string;
};

export type ExerciseAttempt = {
  correct: boolean;
  saved_to_progress: boolean;
};
