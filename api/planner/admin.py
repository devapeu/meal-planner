from django.contrib import admin

from .models import CalendarEntry, Recipe, ShoppingListItem


@admin.register(CalendarEntry)
class CalendarEntryAdmin(admin.ModelAdmin):
    list_display = ("meal", "start_date", "end_date", "recipe")
    list_filter = ("start_date",)
    search_fields = ("meal",)


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(ShoppingListItem)
class ShoppingListItemAdmin(admin.ModelAdmin):
    list_display = ("item", "position")
    ordering = ("position",)

