from datetime import timedelta

from django.db import transaction
from django.db.models import DurationField, ExpressionWrapper, F
from django.utils.dateparse import parse_date
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CalendarEntry, Recipe, ShoppingListItem
from .serializers import (
    CalendarEntrySerializer,
    RecipeSerializer,
    ShoppingListItemSerializer,
)


def _calendar_response(start_date_str: str):
    parsed = parse_date(start_date_str)
    if not parsed:
        return Response(
            {"error": "Invalid or missing startDate"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    monday = parsed - timedelta(days=parsed.weekday())
    sunday = monday + timedelta(days=6)

    duration_expression = ExpressionWrapper(
        F("end_date") - F("start_date"), output_field=DurationField()
    )
    entries = (
        CalendarEntry.objects.filter(start_date__lte=sunday, end_date__gte=monday)
        .annotate(duration_span=duration_expression)
        .order_by("start_date", "-duration_span")
    )
    serializer = CalendarEntrySerializer(entries, many=True)
    return Response({"calendar": serializer.data})


class CalendarView(APIView):
    def get(self, request):
        start_date = request.query_params.get("startDate")
        return _calendar_response(start_date)

    def post(self, request):
        meal = request.data.get("meal")
        start_date = request.data.get("startDate")
        end_date = request.data.get("endDate") or request.data.get("EndDate") or start_date

        if not (meal and start_date):
            return Response(
                {"error": "meal and startDate are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        parsed_start = parse_date(start_date)
        parsed_end = parse_date(end_date)

        if not parsed_start or not parsed_end:
            return Response(
                {"error": "startDate and endDate must be valid dates"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if parsed_end < parsed_start:
            return Response(
                {"error": "endDate cannot be earlier than startDate"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        recipe_identifier = request.data.get("recipeId") or request.data.get("recipe_id")

        CalendarEntry.objects.create(
            meal=meal,
            start_date=parsed_start,
            end_date=parsed_end,
            recipe_id=recipe_identifier,
        )

        return _calendar_response(start_date)


class CalendarDetailView(APIView):
    def delete(self, request, pk: int):
        start_date = request.query_params.get("startDate")
        entry = get_object_or_404(CalendarEntry, pk=pk)
        entry.delete()
        return _calendar_response(start_date or entry.start_date.isoformat())


class ShoppingListView(APIView):
    def get(self, request):
        return self._response()

    def post(self, request):
        item = request.data.get("item")
        if not item:
            return Response(
                {"error": "item is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        ShoppingListItem.objects.create(item=item)
        return self._response()

    def put(self, request):
        item_id = request.data.get("id")
        item_value = request.data.get("item")
        if not (item_id and item_value):
            return Response(
                {"error": "id and item are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        shopping_item = get_object_or_404(ShoppingListItem, pk=item_id)
        shopping_item.item = item_value
        shopping_item.save()
        return self._response()

    def delete(self, request):
        ShoppingListItem.objects.all().delete()
        return self._response()

    def _response(self):
        serializer = ShoppingListItemSerializer(
            ShoppingListItem.objects.order_by("position", "id"), many=True
        )
        return Response({"shopping_list": serializer.data})


class ShoppingListDetailView(APIView):
    def delete(self, request, pk: int):
        item = get_object_or_404(ShoppingListItem, pk=pk)
        item.delete()
        serializer = ShoppingListItemSerializer(
            ShoppingListItem.objects.order_by("position", "id"), many=True
        )
        return Response({"shopping_list": serializer.data})


class ShoppingListReorderView(APIView):
    def put(self, request):
        items = request.data.get("items")
        if not isinstance(items, list):
            return Response(
                {"error": "items must be a list"}, status=status.HTTP_400_BAD_REQUEST
            )

        ids = [entry.get("id") for entry in items if entry.get("id")]
        if not ids:
            return Response(
                {"error": "No valid item ids provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            for index, item_id in enumerate(ids, start=1):
                ShoppingListItem.objects.filter(pk=item_id).update(position=index)

        serializer = ShoppingListItemSerializer(
            ShoppingListItem.objects.order_by("position", "id"), many=True
        )
        return Response({"shopping_list": serializer.data})


class RecipesView(APIView):
    def get(self, request):
        serializer = RecipeSerializer(Recipe.objects.all(), many=True)
        return Response({"recipes": serializer.data})

    def post(self, request):
        serializer = RecipeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return self.get(request)


class RecipeDetailView(APIView):
    def get(self, request, pk: int):
        recipe = get_object_or_404(Recipe, pk=pk)
        serializer = RecipeSerializer(recipe)
        return Response({"recipe": serializer.data})

    def put(self, request, pk: int):
        recipe = get_object_or_404(Recipe, pk=pk)
        serializer = RecipeSerializer(recipe, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return RecipesView().get(request)

    def delete(self, request, pk: int):
        recipe = get_object_or_404(Recipe, pk=pk)
        recipe.delete()
        return RecipesView().get(request)

