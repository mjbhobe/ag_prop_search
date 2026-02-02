"""SQLAlchemy ORM models for PropertyHub."""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship

from .database import Base


class City(Base):
    """City model representing Indian cities."""
    
    __tablename__ = "cities"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    state = Column(String(100), nullable=False)
    
    # Relationship to localities
    localities = relationship("Locality", back_populates="city", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<City(id={self.id}, name='{self.name}')>"


class Locality(Base):
    """Locality model representing areas within a city."""
    
    __tablename__ = "localities"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    city_id = Column(Integer, ForeignKey("cities.id", ondelete="CASCADE"), nullable=False)
    pincode = Column(String(10), nullable=False)
    
    # Relationships
    city = relationship("City", back_populates="localities")
    properties = relationship("Property", back_populates="locality", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Locality(id={self.id}, name='{self.name}')>"


class Property(Base):
    """Property model representing real estate listings."""
    
    __tablename__ = "properties"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(300), nullable=False)
    description = Column(Text)
    locality_id = Column(Integer, ForeignKey("localities.id", ondelete="CASCADE"), nullable=False)
    listing_type = Column(String(10), nullable=False)  # 'rent' or 'buy'
    property_type = Column(String(50), nullable=False)  # 'flat' or 'house'
    bedrooms = Column(Integer, nullable=False)  # 1, 2, or 3
    bathrooms = Column(Integer, nullable=False)
    area_sqft = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    price_unit = Column(String(20), nullable=False)  # 'per_month' or 'total'
    address = Column(String(500), nullable=False)
    image_url = Column(String(500))
    is_furnished = Column(Boolean, default=False)
    floor_number = Column(Integer)
    total_floors = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    locality = relationship("Locality", back_populates="properties")
    
    def __repr__(self):
        return f"<Property(id={self.id}, title='{self.title[:30]}...')>"
