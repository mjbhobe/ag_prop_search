"""CRUD operations for database models."""

from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_

from . import models


# ============== City Operations ==============

def get_cities(db: Session) -> List[models.City]:
    """Get all cities."""
    return db.query(models.City).all()


def get_city(db: Session, city_id: int) -> Optional[models.City]:
    """Get a city by ID."""
    return db.query(models.City).filter(models.City.id == city_id).first()


# ============== Locality Operations ==============

def get_localities_by_city(db: Session, city_id: int) -> List[models.Locality]:
    """Get all localities in a city."""
    return db.query(models.Locality).filter(
        models.Locality.city_id == city_id
    ).order_by(models.Locality.name).all()


def get_locality(db: Session, locality_id: int) -> Optional[models.Locality]:
    """Get a locality by ID."""
    return db.query(models.Locality).options(
        joinedload(models.Locality.city)
    ).filter(models.Locality.id == locality_id).first()


# ============== Property Operations ==============

def get_property(db: Session, property_id: int) -> Optional[models.Property]:
    """Get a property by ID with full location details."""
    return db.query(models.Property).options(
        joinedload(models.Property.locality).joinedload(models.Locality.city)
    ).filter(models.Property.id == property_id).first()


def search_properties(
    db: Session,
    city_id: Optional[int] = None,
    locality_id: Optional[int] = None,
    listing_type: Optional[str] = None,
    property_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bedrooms: Optional[List[int]] = None,
    page: int = 1,
    limit: int = 12
) -> tuple[List[models.Property], int]:
    """
    Search properties with filters.
    Returns tuple of (properties, total_count).
    """
    query = db.query(models.Property).options(
        joinedload(models.Property.locality).joinedload(models.Locality.city)
    )
    
    # Build filter conditions
    conditions = []
    
    if locality_id:
        conditions.append(models.Property.locality_id == locality_id)
    elif city_id:
        # Filter by city through locality
        locality_ids = db.query(models.Locality.id).filter(
            models.Locality.city_id == city_id
        ).subquery()
        conditions.append(models.Property.locality_id.in_(locality_ids))
    
    if listing_type:
        conditions.append(models.Property.listing_type == listing_type)
    
    if property_type:
        conditions.append(models.Property.property_type == property_type)
    
    if min_price is not None:
        conditions.append(models.Property.price >= min_price)
    
    if max_price is not None:
        conditions.append(models.Property.price <= max_price)
    
    if bedrooms:
        conditions.append(models.Property.bedrooms.in_(bedrooms))
    
    # Apply conditions
    if conditions:
        query = query.filter(and_(*conditions))
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * limit
    properties = query.order_by(models.Property.created_at.desc()).offset(offset).limit(limit).all()
    
    return properties, total
