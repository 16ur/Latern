from ninja import Schema


class ExerciseOut(Schema):
    id: int
    title: str
    prompt_latex: str
    hints: list[str]
    difficulty: int
    domain: str


class ExerciseAttemptIn(Schema):
    answer: str


class ExerciseAttemptOut(Schema):
    correct: bool


class ErrorOut(Schema):
    detail: str


class ProgressOut(Schema):
    total_attempts: int
    correct_attempts: int
    success_rate: float
    completed_exercise_ids: list[int]
