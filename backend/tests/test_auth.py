import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.auth import AuthService
from app.schemas.auth import UserCreate

@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    """Test user registration."""
    user_data = {
        "email": "test@example.com",
        "name": "Test User",
        "password": "testpassword123"
    }
    
    response = await client.post("/api/auth/register", json=user_data)
    assert response.status_code == 200
    
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["email"] == user_data["email"]
    assert data["user"]["name"] == user_data["name"]

@pytest.mark.asyncio
async def test_login_user(client: AsyncClient):
    """Test user login."""
    # First register a user
    user_data = {
        "email": "test@example.com",
        "name": "Test User",
        "password": "testpassword123"
    }
    await client.post("/api/auth/register", json=user_data)
    
    # Then login
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    response = await client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data

@pytest.mark.asyncio
async def test_auth_service_register(db_session: AsyncSession):
    """Test AuthService register method."""
    auth_service = AuthService(db_session)
    
    user_data = UserCreate(
        email="service@example.com",
        name="Service User",
        password="password123"
    )
    
    result = await auth_service.register_user(user_data)
    
    assert result.access_token is not None
    assert result.refresh_token is not None
    assert result.user.email == user_data.email
    assert result.user.name == user_data.name