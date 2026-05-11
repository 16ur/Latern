from django.db import models
from django.conf import settings


# Create your models here.
class Domain(models.Model):
    objects: models.Manager["Domain"] = models.Manager()

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Exercise(models.Model):
    objects: models.Manager["Exercise"] = models.Manager()

    domain = models.ForeignKey(
        Domain, on_delete=models.CASCADE, related_name="exercises"
    )
    title = models.CharField(max_length=100)
    prompt_latex = models.TextField()
    accepted_answers = models.JSONField(default=list)
    hints = models.JSONField(default=list)
    difficulty = models.PositiveSmallIntegerField(default=1)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Attempt(models.Model):
    objects: models.Manager["Attempt"] = models.Manager()

    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.CASCADE,
        related_name="attempts",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="attempts",
        null=True,
        blank=True,
    )
    submitted_answer = models.TextField()
    is_correct = models.BooleanField()
    used_hints_count = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.exercise} - {'correct' if self.is_correct else 'wrong'}"
