from django.shortcuts import get_object_or_404
from ninja import Router, Schema
from .models import Exercise
from .services.latex_validation import normalize_latex

router = Router()


# Input schema for exercise attempt
class ExerciseAttemptIn(Schema):
    answer: str


@router.get("/exercises")
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


@router.post("/exercises/{exercise_id}/attempt")
def attempt_exercise(request, exercise_id: int, payload: ExerciseAttemptIn):
    exercise = get_object_or_404(Exercise, id=exercise_id, is_active=True)

    normalized_answer = normalize_latex(payload.answer)

    accepted_answers = [
        normalize_latex(accepted_answer)
        for accepted_answer in exercise.accepted_answers
        if isinstance(accepted_answer, str)
    ]

    return {"correct": normalized_answer in accepted_answers}
