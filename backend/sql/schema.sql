-- PropertyHub Database Schema
-- SQLite Database

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL
);

-- Localities table
CREATE TABLE IF NOT EXISTS localities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    city_id INTEGER NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    locality_id INTEGER NOT NULL,
    listing_type VARCHAR(10) NOT NULL CHECK (listing_type IN ('rent', 'buy')),
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('flat', 'house')),
    bedrooms INTEGER NOT NULL CHECK (bedrooms IN (1, 2, 3)),
    bathrooms INTEGER NOT NULL,
    area_sqft REAL NOT NULL,
    price REAL NOT NULL,
    price_unit VARCHAR(20) NOT NULL CHECK (price_unit IN ('per_month', 'total')),
    address VARCHAR(500) NOT NULL,
    image_url VARCHAR(500),
    is_furnished BOOLEAN DEFAULT FALSE,
    floor_number INTEGER,
    total_floors INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (locality_id) REFERENCES localities(id) ON DELETE CASCADE
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_properties_locality ON properties(locality_id);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_localities_city ON localities(city_id);
