from fastapi import APIRouter, Depends, HTTPException, status
from ..dependencies import DatabaseSession, get_auth_service
from ..services.auth import AuthService
from ..schemas.auth import UserCreate, LoginRequest, TokenResponse, RefreshTokenRequest
from ..utils.security import verify_token, create_access_token

class AuthController:
    def __init__(self):
        self.router = APIRouter(prefix="/auth", tags=["authentication"])
        self._register_routes()
    
    def _register_routes(self):
        self.router.post("/register", response_model=TokenResponse)(self.register)
        self.router.post("/login", response_model=TokenResponse)(self.login)
        self.router.post("/refresh")(self.refresh_token)
        self.router.post("/logout")(self.logout)
    
    async def register(
        self,
        user_data: UserCreate,
        auth_service: AuthService = Depends(get_auth_service)
    ) -> TokenResponse:
        """Register a new user."""
        return await auth_service.register_user(user_data)
    
    async def login(
        self,
        login_data: LoginRequest,
        auth_service: AuthService = Depends(get_auth_service)
    ) -> TokenResponse:
        """Login user."""
        return await auth_service.login_user(login_data.email, login_data.password)
    
    async def refresh_token(
        self,
        refresh_data: RefreshTokenRequest
    ) -> dict:
        """Refresh access token."""
        payload = verify_token(refresh_data.refresh_token, "refresh")
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        new_access_token = create_access_token(data={"sub": user_id})
        return {"access_token": new_access_token, "token_type": "bearer"}
    
    async def logout(self) -> dict:
        """Logout user (client should remove tokens)."""
        return {"message": "Successfully logged out"}

def create_auth_router() -> APIRouter:
    """Factory function to create auth router."""
    controller = AuthController()
    return controller.router