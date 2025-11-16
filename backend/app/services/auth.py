from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from ..repositories.user import UserRepository
from ..models.user import User
from ..schemas.auth import UserCreate, TokenResponse, UserResponse
from ..utils.security import verify_password, get_password_hash, create_access_token, create_refresh_token

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)
    
    async def register_user(self, user_data: UserCreate) -> TokenResponse:
        """Register a new user."""
        # Check if user already exists
        existing_user = await self.user_repo.get_by_email(user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        hashed_password = get_password_hash(user_data.password)
        user = await self.user_repo.create_user(
            email=user_data.email,
            name=user_data.name,
            hashed_password=hashed_password
        )
        
        # Generate tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse.model_validate(user)
        )
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user credentials."""
        user = await self.user_repo.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user
    
    async def login_user(self, email: str, password: str) -> TokenResponse:
        """Login user and return tokens."""
        user = await self.authenticate_user(email, password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse.model_validate(user)
        )
    
    async def get_current_user(self, user_id: str) -> User:
        """Get current user by ID."""
        user = await self.user_repo.get(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user