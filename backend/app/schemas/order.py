from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from .banner import BannerConfigResponse

class OrderItemResponse(BaseModel):
    id: str
    price: Decimal
    banner_config: BannerConfigResponse
    file_name: str
    file_url: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: str
    status: str
    total_price: Decimal
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    items: List[dict]  # Will contain config and file data

class OrderStatusUpdate(BaseModel):
    status: str