from django.shortcuts import get_object_or_404
from ninja import Router

from .models import Exercise
from .schemas import ExerciseOut, ExerciseAttemptIn, ExerciseAttemptOut
from .services.latex_validation import normalize_latex

router = Router()


@router.get("/exercises", response=list[ExerciseOut])
def list_exercises(request):
    exercises = Exercise.objects.filter(is_active=True).order_by("domain", "order")

    return [
        {
            "id": exercise.id,
            "title": exercise.title,
            "prompt_latex": exercise.prompt_latex,
            "hints": exercise.hints,
            "difficulty": exercise.difficulty,
            "domain": exercise.domain.slug,
        }
        for exercise in exercises
    ]


@router.get("/exercises/{exercise_id}", response=ExerciseOut)
def get_exercise(request, exercise_id: int):
    exercise = get_object_or_404(Exercise, id=exercise_id, is_active=True)

    return {
        "id": exercise.id,
        "title": exercise.title,
        "prompt_latex": exercise.prompt_latex,
        "hints": exercise.hints,
        "difficulty": exercise.difficulty,
        "domain": exercise.domain.slug,
    }


@router.post("/exercises/{exercise_id}/attempt", response=ExerciseAttemptOut)
def attempt_exercise(request, exercise_id: int, payload: ExerciseAttemptIn):
    exercise = get_object_or_404(Exercise, id=exercise_id, is_active=True)

    normalized_answer = normalize_latex(payload.answer)

    accepted_answers = [
        normalize_latex(accepted_answer)
        for accepted_answer in exercise.accepted_answers
        if isinstance(accepted_answer, str)
    ]

    return {"correct": normalized_answer in accepted_answers}
