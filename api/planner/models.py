from django.db import models
from django.db.models import Max


class Recipe(models.Model):
    name = models.CharField(max_length=255)
    content = models.TextField()

    def __str__(self) -> str:
        return self.name


class CalendarEntry(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    meal = models.CharField(max_length=255)
    recipe = models.ForeignKey(
        Recipe,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="calendar_entries",
    )

    class Meta:
        ordering = ["start_date", "-end_date", "id"]

    def __str__(self) -> str:
        return f"{self.meal} ({self.start_date} - {self.end_date})"


class ShoppingListItem(models.Model):
    item = models.CharField(max_length=255)
    position = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ["position", "id"]

    def __str__(self) -> str:
        return self.item

    def save(self, *args, **kwargs):
        if not self.position:
            max_position = (
                ShoppingListItem.objects.aggregate(max_pos=Max("position"))["max_pos"]
                or 0
            )
            self.position = max_position + 1
        super().save(*args, **kwargs)

