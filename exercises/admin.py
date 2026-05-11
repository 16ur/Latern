from django.contrib import admin
from .models import Domain, Exercise, Attempt
# Register your models here.


@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ("title", "domain", "difficulty", "order", "is_active")
    list_filter = ("domain", "difficulty", "is_active")
    search_fields = ("title", "prompt_latex")


@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = ("exercise", "user", "is_correct", "used_hints_count", "created_at")
    list_filter = ("is_correct", "created_at")
    search_fields = ("exercise__title", "submitted_answer")
