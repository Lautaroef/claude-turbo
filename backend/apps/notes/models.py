from django.conf import settings
from django.db import models


class Category(models.Model):
    """Category model for organizing notes."""

    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#F5C4A1')  # Hex color
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='categories'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']
        unique_together = ['name', 'user']

    def __str__(self):
        return self.name


class Note(models.Model):
    """Note model for storing user notes."""

    title = models.CharField(max_length=255, blank=True, default='')
    content = models.TextField(blank=True, default='')
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notes'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.title
