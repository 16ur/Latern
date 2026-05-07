from django.db import models


# Create your models here.
class Domain(models.Model):
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
