import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

from apps.notes.models import Category, Note

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return User.objects.create_user(
        email="test@example.com",
        password="TestPass123!",
    )


@pytest.fixture
def other_user():
    return User.objects.create_user(
        email="other@example.com",
        password="TestPass123!",
    )


@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def category(user):
    return Category.objects.create(
        name="Test Category",
        color="#F5C4A1",
        user=user,
    )


@pytest.fixture
def note(user, category):
    return Note.objects.create(
        title="Test Note",
        content="Test content",
        category=category,
        user=user,
    )


def get_results(response):
    """Helper to get results from paginated or non-paginated response."""
    if isinstance(response.data, dict) and "results" in response.data:
        return response.data["results"]
    return response.data


@pytest.mark.django_db
class TestCategories:
    def test_list_categories(self, authenticated_client, category):
        response = authenticated_client.get("/api/categories/")
        assert response.status_code == status.HTTP_200_OK
        results = get_results(response)
        assert len(results) == 1
        assert results[0]["name"] == "Test Category"

    def test_create_category(self, authenticated_client):
        response = authenticated_client.post(
            "/api/categories/",
            {"name": "New Category", "color": "#F5E6A3"},
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["name"] == "New Category"

    def test_seed_default_categories(self, authenticated_client):
        response = authenticated_client.post("/api/categories/seed_defaults/")
        assert response.status_code == status.HTTP_200_OK
        assert "created" in response.data

        # Verify defaults were created
        response = authenticated_client.get("/api/categories/")
        results = get_results(response)
        category_names = [c["name"] for c in results]
        assert "Random Thoughts" in category_names
        assert "School" in category_names
        assert "Personal" in category_names

    def test_categories_are_user_specific(self, authenticated_client, other_user):
        # Create category for other user
        Category.objects.create(
            name="Other User Category",
            color="#A8D5D8",
            user=other_user,
        )

        # Should not see other user's category
        response = authenticated_client.get("/api/categories/")
        results = get_results(response)
        category_names = [c["name"] for c in results]
        assert "Other User Category" not in category_names


@pytest.mark.django_db
class TestNotes:
    def test_list_notes(self, authenticated_client, note):
        response = authenticated_client.get("/api/notes/")
        assert response.status_code == status.HTTP_200_OK
        results = get_results(response)
        assert len(results) == 1
        assert results[0]["title"] == "Test Note"

    def test_create_note(self, authenticated_client, category):
        response = authenticated_client.post(
            "/api/notes/",
            {"title": "New Note", "content": "New content", "category": category.id},
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == "New Note"
        assert response.data["category_name"] == "Test Category"

    def test_get_note(self, authenticated_client, note):
        response = authenticated_client.get(f"/api/notes/{note.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == "Test Note"

    def test_update_note(self, authenticated_client, note):
        response = authenticated_client.patch(
            f"/api/notes/{note.id}/",
            {"title": "Updated Title"},
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == "Updated Title"

    def test_delete_note(self, authenticated_client, note):
        response = authenticated_client.delete(f"/api/notes/{note.id}/")
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Note.objects.filter(id=note.id).exists()

    def test_filter_notes_by_category(self, authenticated_client, user, category):
        # Create notes in different categories
        other_category = Category.objects.create(
            name="Other Category",
            color="#A8D5D8",
            user=user,
        )
        Note.objects.create(title="Note 1", category=category, user=user)
        Note.objects.create(title="Note 2", category=other_category, user=user)

        # Filter by category
        response = authenticated_client.get(f"/api/notes/?category={category.id}")
        assert response.status_code == status.HTTP_200_OK
        results = get_results(response)
        assert len(results) == 1
        assert results[0]["title"] == "Note 1"

    def test_notes_are_user_specific(self, authenticated_client, other_user, category):
        # Create note for other user
        other_category = Category.objects.create(
            name="Other Category",
            color="#A8D5D8",
            user=other_user,
        )
        Note.objects.create(
            title="Other User Note",
            category=other_category,
            user=other_user,
        )

        # Should not see other user's notes
        response = authenticated_client.get("/api/notes/")
        results = get_results(response)
        note_titles = [n["title"] for n in results]
        assert "Other User Note" not in note_titles

    def test_cannot_use_other_users_category(self, authenticated_client, other_user):
        # Create category for other user
        other_category = Category.objects.create(
            name="Other Category",
            color="#A8D5D8",
            user=other_user,
        )

        # Try to create note with other user's category
        response = authenticated_client.post(
            "/api/notes/",
            {"title": "Test", "category": other_category.id},
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
