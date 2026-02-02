"""Seed script to populate database with sample data."""

import random
from datetime import datetime, timedelta

from app.database import SessionLocal, engine, Base
from app.models import City, Locality, Property

# Ensure tables exist
Base.metadata.create_all(bind=engine)


# ============== Locality Data ==============

MUMBAI_LOCALITIES = [
    ("Bandra West", "400050"),
    ("Bandra East", "400051"),
    ("Dadar West", "400028"),
    ("Dadar East", "400014"),
    ("Andheri West", "400053"),
    ("Andheri East", "400069"),
    ("Borivali West", "400092"),
    ("Borivali East", "400066"),
    ("Malad West", "400064"),
    ("Malad East", "400097"),
    ("Kandivali West", "400067"),
    ("Kandivali East", "400101"),
    ("Mahim West", "400016"),
    ("Mahim East", "400017"),
    ("Lower Parel", "400013"),
    ("Prabhadevi", "400025"),
]

BANGALORE_LOCALITIES = [
    ("Koramangala", "560034"),
    ("Indiranagar", "560038"),
    ("Whitefield", "560066"),
    ("HSR Layout", "560102"),
    ("Jayanagar", "560041"),
    ("Electronic City", "560100"),
    ("Marathahalli", "560037"),
    ("Hebbal", "560024"),
]


# ============== Property Generation ==============

FLAT_NAMES = [
    "Skyline Residency", "Palm Grove Apartments", "Royal Heights", "Green Valley",
    "Ocean View Towers", "Sunrise Apartments", "Crystal Palace", "Golden Gate",
    "Silver Oak Residency", "Park View Apartments", "Lake View Towers", "City Centre",
    "Metro Heights", "Garden Estate", "Central Park", "Blue Ridge Apartments",
    "Highland Towers", "Prestige Enclave", "Brigade Gateway", "Sobha Dream Acres"
]

HOUSE_NAMES = [
    "Villa Serenity", "Independent House", "Bungalow Paradise", "Heritage Home",
    "Modern Villa", "Family Residence", "Luxury Villa", "Private Bungalow",
    "Garden House", "Spacious Villa", "Corner House", "Premium Villa"
]

FLAT_DESCRIPTIONS = [
    "Modern apartment with excellent amenities including gym, swimming pool, and 24/7 security.",
    "Well-maintained flat in a prime location with good connectivity to metro station.",
    "Spacious apartment with natural lighting and cross ventilation. Covered parking available.",
    "Contemporary flat with modular kitchen and premium fittings throughout.",
    "Gated community apartment with children's play area and landscaped gardens.",
    "Premium flat with club house access and power backup. Near IT parks.",
]

HOUSE_DESCRIPTIONS = [
    "Independent house with private garden and parking space. Quiet neighborhood.",
    "Spacious bungalow with modern amenities. Ideal for large families.",
    "Well-constructed house with terrace and servant quarters available.",
    "Luxury villa with swimming pool and landscaped garden.",
    "Corner plot house with excellent ventilation and natural light.",
    "Premium villa in gated community with 24/7 security.",
]


def generate_price(listing_type: str, property_type: str, bedrooms: int, city: str) -> float:
    """Generate realistic price based on property attributes."""
    base_rent = {
        "Mumbai": {1: 25000, 2: 40000, 3: 60000},
        "Bangalore": {1: 18000, 2: 30000, 3: 45000}
    }
    base_buy = {
        "Mumbai": {1: 8000000, 2: 15000000, 3: 25000000},
        "Bangalore": {1: 5000000, 2: 9000000, 3: 15000000}
    }
    
    if property_type == "house":
        multiplier = random.uniform(1.3, 1.8)
    else:
        multiplier = random.uniform(0.8, 1.2)
    
    if listing_type == "rent":
        base = base_rent[city][bedrooms]
    else:
        base = base_buy[city][bedrooms]
    
    price = base * multiplier
    # Round to reasonable values
    if listing_type == "rent":
        return round(price / 1000) * 1000
    else:
        return round(price / 100000) * 100000


def generate_area(bedrooms: int, property_type: str) -> float:
    """Generate area in sqft based on bedrooms and type."""
    base_area = {1: 550, 2: 950, 3: 1400}
    if property_type == "house":
        multiplier = random.uniform(1.2, 1.6)
    else:
        multiplier = random.uniform(0.9, 1.1)
    return round(base_area[bedrooms] * multiplier)


def create_property(
    locality: Locality,
    listing_type: str,
    property_type: str,
    bedrooms: int,
    city_name: str,
    index: int
) -> Property:
    """Create a single property with realistic data."""
    
    if property_type == "flat":
        name = random.choice(FLAT_NAMES)
        description = random.choice(FLAT_DESCRIPTIONS)
        floor_number = random.randint(1, 15)
        total_floors = random.randint(floor_number, 20)
    else:
        name = random.choice(HOUSE_NAMES)
        description = random.choice(HOUSE_DESCRIPTIONS)
        floor_number = None
        total_floors = random.randint(2, 3)
    
    area = generate_area(bedrooms, property_type)
    price = generate_price(listing_type, property_type, bedrooms, city_name)
    price_unit = "per_month" if listing_type == "rent" else "total"
    
    title = f"{bedrooms} BHK {property_type.title()} for {'Rent' if listing_type == 'rent' else 'Sale'} in {locality.name}"
    address = f"{name}, {locality.name}, {city_name}"
    
    # Use placeholder images from picsum
    image_url = f"https://picsum.photos/seed/{locality.id}{index}/800/600"
    
    is_furnished = random.choice([True, False])
    bathrooms = bedrooms if bedrooms < 3 else random.randint(2, 3)
    
    # Random date in last 30 days
    days_ago = random.randint(1, 30)
    created_at = datetime.utcnow() - timedelta(days=days_ago)
    
    return Property(
        title=title,
        description=description,
        locality_id=locality.id,
        listing_type=listing_type,
        property_type=property_type,
        bedrooms=bedrooms,
        bathrooms=bathrooms,
        area_sqft=area,
        price=price,
        price_unit=price_unit,
        address=address,
        image_url=image_url,
        is_furnished=is_furnished,
        floor_number=floor_number,
        total_floors=total_floors,
        created_at=created_at
    )


def seed_database():
    """Seed the database with cities, localities, and properties."""
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Property).delete()
        db.query(Locality).delete()
        db.query(City).delete()
        db.commit()
        
        print("Creating cities...")
        
        # Create cities
        mumbai = City(name="Mumbai", state="Maharashtra")
        bangalore = City(name="Bangalore", state="Karnataka")
        db.add_all([mumbai, bangalore])
        db.commit()
        
        print("Creating localities...")
        
        # Create Mumbai localities
        mumbai_localities = []
        for name, pincode in MUMBAI_LOCALITIES:
            locality = Locality(name=name, city_id=mumbai.id, pincode=pincode)
            mumbai_localities.append(locality)
        db.add_all(mumbai_localities)
        db.commit()
        
        # Create Bangalore localities
        bangalore_localities = []
        for name, pincode in BANGALORE_LOCALITIES:
            locality = Locality(name=name, city_id=bangalore.id, pincode=pincode)
            bangalore_localities.append(locality)
        db.add_all(bangalore_localities)
        db.commit()
        
        print("Creating properties...")
        
        property_count = 0
        
        # Generate properties for Mumbai (10-12 per locality)
        for locality in mumbai_localities:
            num_properties = random.randint(10, 12)
            for i in range(num_properties):
                listing_type = random.choice(["rent", "buy"])
                property_type = random.choice(["flat", "flat", "flat", "house"])  # 75% flats
                bedrooms = random.choice([1, 2, 2, 3])  # More 2BHK
                
                prop = create_property(
                    locality=locality,
                    listing_type=listing_type,
                    property_type=property_type,
                    bedrooms=bedrooms,
                    city_name="Mumbai",
                    index=i
                )
                db.add(prop)
                property_count += 1
        
        # Generate properties for Bangalore (12-14 per locality)
        for locality in bangalore_localities:
            num_properties = random.randint(12, 14)
            for i in range(num_properties):
                listing_type = random.choice(["rent", "buy"])
                property_type = random.choice(["flat", "flat", "house"])  # 67% flats
                bedrooms = random.choice([1, 2, 2, 3])  # More 2BHK
                
                prop = create_property(
                    locality=locality,
                    listing_type=listing_type,
                    property_type=property_type,
                    bedrooms=bedrooms,
                    city_name="Bangalore",
                    index=i
                )
                db.add(prop)
                property_count += 1
        
        db.commit()
        
        print(f"\nDatabase seeded successfully!")
        print(f"  Cities: 2")
        print(f"  Mumbai localities: {len(mumbai_localities)}")
        print(f"  Bangalore localities: {len(bangalore_localities)}")
        print(f"  Properties: {property_count}")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
