"""Pydantic schemas for request/response validation."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# ============== City Schemas ==============

class CityBase(BaseModel):
    """Base schema for City."""
    name: str
    state: str


class CityResponse(CityBase):
    """Response schema for City."""
    id: int
    
    model_config = {"from_attributes": True}


# ============== Locality Schemas ==============

class LocalityBase(BaseModel):
    """Base schema for Locality."""
    name: str
    pincode: str


class LocalityResponse(LocalityBase):
    """Response schema for Locality."""
    id: int
    city_id: int
    
    model_config = {"from_attributes": True}


class LocalityWithCity(LocalityResponse):
    """Locality response with city information."""
    city: CityResponse


# ============== Property Schemas ==============

class PropertyBase(BaseModel):
    """Base schema for Property."""
    title: str
    description: Optional[str] = None
    listing_type: str = Field(..., pattern="^(rent|buy)$")
    property_type: str = Field(..., pattern="^(flat|house)$")
    bedrooms: int = Field(..., ge=1, le=3)
    bathrooms: int = Field(..., ge=1)
    area_sqft: float = Field(..., gt=0)
    price: float = Field(..., gt=0)
    price_unit: str = Field(..., pattern="^(per_month|total)$")
    address: str
    image_url: Optional[str] = None
    is_furnished: bool = False
    floor_number: Optional[int] = None
    total_floors: Optional[int] = None


class PropertyResponse(PropertyBase):
    """Response schema for Property."""
    id: int
    locality_id: int
    created_at: datetime
    
    model_config = {"from_attributes": True}


class PropertyWithLocation(PropertyResponse):
    """Property response with locality and city information."""
    locality: LocalityWithCity


class PropertyListResponse(BaseModel):
    """Paginated list of properties."""
    items: List[PropertyWithLocation]
    total: int
    page: int
    limit: int
    total_pages: int


# ============== Search/Filter Schemas ==============

class PropertySearchParams(BaseModel):
    """Query parameters for property search."""
    city_id: Optional[int] = None
    locality_id: Optional[int] = None
    listing_type: Optional[str] = Field(default=None, pattern="^(rent|buy)$")
    property_type: Optional[str] = Field(default=None, pattern="^(flat|house)$")
    min_price: Optional[float] = Field(default=None, ge=0)
    max_price: Optional[float] = Field(default=None, ge=0)
    bedrooms: Optional[List[int]] = None
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=12, ge=1, le=50)
