from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import Category, Note
from .serializers import CategorySerializer, NoteSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing categories."""

    serializer_class = CategorySerializer
    pagination_class = None  # Categories are a small list, no pagination needed

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user).annotate(
            notes_count=Count('notes')
        ).order_by('name')

    @action(detail=False, methods=['post'])
    def seed_defaults(self, request):
        """Create default categories for the user if they don't exist."""
        defaults = [
            {'name': 'Random Thoughts', 'color': '#F5C4A1'},
            {'name': 'School', 'color': '#F5E6A3'},
            {'name': 'Personal', 'color': '#A8D5D8'},
        ]

        created = []
        for cat_data in defaults:
            category, was_created = Category.objects.get_or_create(
                user=request.user,
                name=cat_data['name'],
                defaults={'color': cat_data['color']}
            )
            if was_created:
                created.append(CategorySerializer(category).data)

        return Response({
            'message': f'Created {len(created)} default categories',
            'created': created
        })


class NoteViewSet(viewsets.ModelViewSet):
    """ViewSet for managing notes."""

    serializer_class = NoteSerializer

    def get_queryset(self):
        queryset = Note.objects.filter(user=self.request.user).select_related('category')

        # Filter by category if provided
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        return queryset
