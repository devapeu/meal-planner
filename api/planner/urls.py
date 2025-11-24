from django.urls import path

from .auth_views import CurrentUserView, LoginView, LogoutView, RegisterView
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
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/user/", CurrentUserView.as_view(), name="auth-user"),
    path("calendar/", CalendarView.as_view(), name="calendar"),
    path("calendar/<int:pk>/", CalendarDetailView.as_view(), name="calendar-detail"),
    path("shopping-list/", ShoppingListView.as_view(), name="shopping-list"),
    path(
        "shopping-list/<int:pk>/",
        ShoppingListDetailView.as_view(),
        name="shopping-list-detail",
    ),
    path(
        "shopping-list/reorder/",
        ShoppingListReorderView.as_view(),
        name="shopping-list-reorder",
    ),
    path("recipes/", RecipesView.as_view(), name="recipes"),
    path("recipes/<int:pk>/", RecipeDetailView.as_view(), name="recipe-detail"),
]

