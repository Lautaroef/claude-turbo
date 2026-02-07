import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user_data():
    return {
        "email": "test@example.com",
        "password": "TestPass123!",
        "password_confirm": "TestPass123!",
    }


@pytest.fixture
def user(user_data):
    return User.objects.create_user(
        email=user_data["email"],
        password=user_data["password"],
    )


@pytest.mark.django_db
class TestRegistration:
    def test_register_success(self, api_client, user_data):
        response = api_client.post("/api/auth/register/", user_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert "user" in response.data
        assert "tokens" in response.data
        assert response.data["user"]["email"] == user_data["email"]

    def test_register_password_mismatch(self, api_client, user_data):
        user_data["password_confirm"] = "DifferentPass123!"
        response = api_client.post("/api/auth/register/", user_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_duplicate_email(self, api_client, user_data, user):
        response = api_client.post("/api/auth/register/", user_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestLogin:
    def test_login_success(self, api_client, user_data, user):
        response = api_client.post(
            "/api/auth/login/",
            {"email": user_data["email"], "password": user_data["password"]},
        )
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert "refresh" in response.data

    def test_login_wrong_password(self, api_client, user_data, user):
        response = api_client.post(
            "/api/auth/login/",
            {"email": user_data["email"], "password": "WrongPass123!"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_nonexistent_user(self, api_client):
        response = api_client.post(
            "/api/auth/login/",
            {"email": "nonexistent@example.com", "password": "SomePass123!"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestMe:
    def test_me_authenticated(self, api_client, user_data, user):
        # Login first
        login_response = api_client.post(
            "/api/auth/login/",
            {"email": user_data["email"], "password": user_data["password"]},
        )
        token = login_response.data["access"]

        # Get me
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = api_client.get("/api/auth/me/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["email"] == user_data["email"]

    def test_me_unauthenticated(self, api_client):
        response = api_client.get("/api/auth/me/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
