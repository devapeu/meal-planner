from django.urls import path

from .views import (
    CalendarDetailView,
    CalendarView,
    RecipeDetailView,
    RecipesView,
    ShoppingListDetailView,
    ShoppingListReorderView,
    ShoppingListView,
)

urlpatterns = [
    path("calendar", CalendarView.as_view(), name="calendar"),
    path("calendar/<int:pk>", CalendarDetailView.as_view(), name="calendar-detail"),
    path("shopping-list", ShoppingListView.as_view(), name="shopping-list"),
    path(
        "shopping-list/<int:pk>",
        ShoppingListDetailView.as_view(),
        name="shopping-list-detail",
    ),
    path(
        "shopping-list/reorder",
        ShoppingListReorderView.as_view(),
        name="shopping-list-reorder",
    ),
    path("recipes", RecipesView.as_view(), name="recipes"),
    path("recipes/<int:pk>", RecipeDetailView.as_view(), name="recipe-detail"),
]

