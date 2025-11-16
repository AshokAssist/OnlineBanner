from pydantic import BaseModel, Field
from typing import Literal
from decimal import Decimal

class BannerConfigCreate(BaseModel):
    width_cm: int = Field(..., ge=10, le=1000)
    height_cm: int = Field(..., ge=10, le=1000)
    material: Literal["vinyl", "flex", "fabric", "mesh"]
    grommets: bool = False
    lamination: bool = False

class BannerConfigResponse(BaseModel):
    id: str
    width_cm: int
    height_cm: int
    material: str
    grommets: bool
    lamination: bool
    calculated_price: Decimal
    
    class Config:
        from_attributes = True

class PriceCalculationRequest(BaseModel):
    width_cm: int = Field(..., ge=10, le=1000, alias="widthCm")
    height_cm: int = Field(..., ge=10, le=1000, alias="heightCm")
    material: Literal["vinyl", "flex", "fabric", "mesh"]
    grommets: bool = False
    lamination: bool = False
    
    class Config:
        populate_by_name = True  # Allow both snake_case and camelCase

class PriceCalculationResponse(BaseModel):
    price: Decimal