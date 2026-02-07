from rest_framework import serializers

from .models import Category, Note


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""

    notes_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'color', 'notes_count', 'created_at')
        read_only_fields = ('id', 'created_at')

    def get_notes_count(self, obj):
        return obj.notes.count()

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class NoteSerializer(serializers.ModelSerializer):
    """Serializer for Note model."""

    title = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)

    class Meta:
        model = Note
        fields = (
            'id', 'title', 'content', 'category', 'category_name',
            'category_color', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_category(self, value):
        if value and value.user != self.context['request'].user:
            raise serializers.ValidationError("Category does not belong to you.")
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
