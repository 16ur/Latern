from django.contrib import admin
from .models import Domain, Exercise
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
