from django.contrib import admin

from .models import Category, Note


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'color', 'user', 'created_at')
    list_filter = ('user',)
    search_fields = ('name',)


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'user', 'created_at', 'updated_at')
    list_filter = ('category', 'user', 'created_at')
    search_fields = ('title', 'content')
    date_hierarchy = 'created_at'
