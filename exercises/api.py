from django.shortcuts import get_object_or_404
from ninja import Router

from .models import Exercise, Attempt
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

    is_correct = normalized_answer in accepted_answers
    Attempt.objects.create(
        exercise=exercise,
        user=request.user if request.user.is_authenticated else None,
        submitted_answer=payload.answer,
        is_correct=is_correct,
    )

    return {
        "correct": is_correct,
    }


@router.get("/me/progress")
def get_my_progress(request) -> dict:
    attempts = Attempt.objects.all()

    total_attempts = attempts.count()
    correct_attempts = attempts.filter(is_correct=True).count()
    completed_exercise_ids = (
        attempts.filter(is_correct=True)
        .values_list("exercise_id", flat=True)
        .distinct()
    )

    return {
        "total_attempts": total_attempts,
        "correct_attempts": correct_attempts,
        "success_rate": correct_attempts / total_attempts if total_attempts > 0 else 0,
        "completed_exercise_ids": list(completed_exercise_ids),
    }
