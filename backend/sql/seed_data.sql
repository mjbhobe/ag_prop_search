-- PropertyHub Sample Data
-- Run after schema.sql

-- Insert Cities
INSERT INTO cities (name, state) VALUES ('Mumbai', 'Maharashtra');
INSERT INTO cities (name, state) VALUES ('Bangalore', 'Karnataka');

-- Mumbai Localities (city_id = 1)
INSERT INTO localities (name, city_id, pincode) VALUES ('Bandra West', 1, '400050');
INSERT INTO localities (name, city_id, pincode) VALUES ('Bandra East', 1, '400051');
INSERT INTO localities (name, city_id, pincode) VALUES ('Dadar West', 1, '400028');
INSERT INTO localities (name, city_id, pincode) VALUES ('Dadar East', 1, '400014');
INSERT INTO localities (name, city_id, pincode) VALUES ('Andheri West', 1, '400053');
INSERT INTO localities (name, city_id, pincode) VALUES ('Andheri East', 1, '400069');
INSERT INTO localities (name, city_id, pincode) VALUES ('Borivali West', 1, '400092');
INSERT INTO localities (name, city_id, pincode) VALUES ('Borivali East', 1, '400066');
INSERT INTO localities (name, city_id, pincode) VALUES ('Malad West', 1, '400064');
INSERT INTO localities (name, city_id, pincode) VALUES ('Malad East', 1, '400097');
INSERT INTO localities (name, city_id, pincode) VALUES ('Kandivali West', 1, '400067');
INSERT INTO localities (name, city_id, pincode) VALUES ('Kandivali East', 1, '400101');
INSERT INTO localities (name, city_id, pincode) VALUES ('Mahim West', 1, '400016');
INSERT INTO localities (name, city_id, pincode) VALUES ('Mahim East', 1, '400017');
INSERT INTO localities (name, city_id, pincode) VALUES ('Lower Parel', 1, '400013');
INSERT INTO localities (name, city_id, pincode) VALUES ('Prabhadevi', 1, '400025');

-- Bangalore Localities (city_id = 2)
INSERT INTO localities (name, city_id, pincode) VALUES ('Koramangala', 2, '560034');
INSERT INTO localities (name, city_id, pincode) VALUES ('Indiranagar', 2, '560038');
INSERT INTO localities (name, city_id, pincode) VALUES ('Whitefield', 2, '560066');
INSERT INTO localities (name, city_id, pincode) VALUES ('HSR Layout', 2, '560102');
INSERT INTO localities (name, city_id, pincode) VALUES ('Jayanagar', 2, '560041');
INSERT INTO localities (name, city_id, pincode) VALUES ('Electronic City', 2, '560100');
INSERT INTO localities (name, city_id, pincode) VALUES ('Marathahalli', 2, '560037');
INSERT INTO localities (name, city_id, pincode) VALUES ('Hebbal', 2, '560024');

-- Note: Property data is generated via seed_data.py script for realistic randomized data
-- The Python script generates 10-15 properties per locality with:
--   - Mix of rent/buy listings
--   - Mix of flat/house property types
--   - 1/2/3 BHK configurations
--   - Realistic Mumbai/Bangalore pricing
--   - Placeholder images from picsum.photos
