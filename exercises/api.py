from ninja import Router
from .models import Exercise

router = Router()


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
