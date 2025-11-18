from rest_framework import serializers

from .models import CalendarEntry, Recipe, ShoppingListItem


class CalendarEntrySerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    recipe_id = serializers.IntegerField(source="recipe_id", read_only=True)

    class Meta:
        model = CalendarEntry
        fields = ["id", "meal", "start_date", "end_date", "duration", "recipe_id"]

    def get_duration(self, obj: CalendarEntry) -> int:
        return (obj.end_date - obj.start_date).days + 1


class ShoppingListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingListItem
        fields = ["id", "item"]


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ["id", "name", "content"]

