"""API routes for properties, cities, and localities."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import math

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api", tags=["properties"])


# ============== City Endpoints ==============

@router.get("/cities", response_model=List[schemas.CityResponse])
def get_cities(db: Session = Depends(get_db)):
    """Get all available cities."""
    return crud.get_cities(db)


@router.get("/cities/{city_id}", response_model=schemas.CityResponse)
def get_city(city_id: int, db: Session = Depends(get_db)):
    """Get a specific city by ID."""
    city = crud.get_city(db, city_id)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city


@router.get("/cities/{city_id}/localities", response_model=List[schemas.LocalityResponse])
def get_localities_by_city(city_id: int, db: Session = Depends(get_db)):
    """Get all localities within a specific city."""
    city = crud.get_city(db, city_id)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return crud.get_localities_by_city(db, city_id)


# ============== Property Endpoints ==============

@router.get("/properties", response_model=schemas.PropertyListResponse)
def search_properties(
    city_id: Optional[int] = Query(default=None, description="Filter by city"),
    locality_id: Optional[int] = Query(default=None, description="Filter by locality"),
    listing_type: Optional[str] = Query(default=None, pattern="^(rent|buy)$", description="rent or buy"),
    property_type: Optional[str] = Query(default=None, pattern="^(flat|house)$", description="flat or house"),
    min_price: Optional[float] = Query(default=None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(default=None, ge=0, description="Maximum price"),
    bedrooms: Optional[List[int]] = Query(default=None, description="Filter by bedroom count (1, 2, or 3)"),
    page: int = Query(default=1, ge=1, description="Page number"),
    limit: int = Query(default=12, ge=1, le=50, description="Items per page"),
    db: Session = Depends(get_db)
):
    """
    Search properties with various filters.
    
    - **city_id**: Filter by city
    - **locality_id**: Filter by specific locality (overrides city_id)
    - **listing_type**: 'rent' or 'buy'
    - **property_type**: 'flat' or 'house'
    - **min_price / max_price**: Budget range
    - **bedrooms**: List of bedroom counts [1, 2, 3]
    """
    properties, total = crud.search_properties(
        db=db,
        city_id=city_id,
        locality_id=locality_id,
        listing_type=listing_type,
        property_type=property_type,
        min_price=min_price,
        max_price=max_price,
        bedrooms=bedrooms,
        page=page,
        limit=limit
    )
    
    total_pages = math.ceil(total / limit) if total > 0 else 1
    
    return schemas.PropertyListResponse(
        items=properties,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )


@router.get("/properties/{property_id}", response_model=schemas.PropertyWithLocation)
def get_property(property_id: int, db: Session = Depends(get_db)):
    """Get detailed information about a specific property."""
    property_obj = crud.get_property(db, property_id)
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_obj
