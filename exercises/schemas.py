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
