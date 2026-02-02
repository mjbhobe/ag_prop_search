import { useState, useEffect } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { getCities, getLocalitiesByCity } from '../services/api';
import './FilterPanel.css';

function FilterPanel({ filters, onFilterChange }) {
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadCities() {
      try {
        const data = await getCities();
        setCities(data);
      } catch (error) {
        console.error('Error loading cities:', error);
      }
    }
    loadCities();
  }, []);

  useEffect(() => {
    async function loadLocalities() {
      if (filters.city_id) {
        try {
          const data = await getLocalitiesByCity(filters.city_id);
          setLocalities(data);
        } catch (error) {
          console.error('Error loading localities:', error);
        }
      } else {
        setLocalities([]);
      }
    }
    loadLocalities();
  }, [filters.city_id]);

  const handleChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    if (name === 'city_id') {
      newFilters.locality_id = '';
    }
    onFilterChange(newFilters);
  };

  const handleBedroomToggle = (bed) => {
    const current = filters.bedrooms || [];
    const newBedrooms = current.includes(bed)
      ? current.filter(b => b !== bed)
      : [...current, bed];
    onFilterChange({ ...filters, bedrooms: newBedrooms });
  };

  const clearFilters = () => {
    onFilterChange({
      listing_type: filters.listing_type,
      page: 1
    });
  };

  return (
    <>
      <button 
        className="filter-toggle-mobile btn btn-secondary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiFilter size={18} />
        Filters
      </button>
      
      <aside className={`filter-panel ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h3>Filters</h3>
          <button className="filter-close" onClick={() => setIsOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        <div className="filter-section">
          <label className="filter-label">Listing Type</label>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filters.listing_type === 'rent' ? 'active' : ''}`}
              onClick={() => handleChange('listing_type', 'rent')}
            >
              Rent
            </button>
            <button
              className={`filter-tab ${filters.listing_type === 'buy' ? 'active' : ''}`}
              onClick={() => handleChange('listing_type', 'buy')}
            >
              Buy
            </button>
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-label">City</label>
          <select
            className="form-select"
            value={filters.city_id || ''}
            onChange={(e) => handleChange('city_id', e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <label className="filter-label">Locality</label>
          <select
            className="form-select"
            value={filters.locality_id || ''}
            onChange={(e) => handleChange('locality_id', e.target.value)}
            disabled={!filters.city_id}
          >
            <option value="">All Localities</option>
            {localities.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <label className="filter-label">Property Type</label>
          <select
            className="form-select"
            value={filters.property_type || ''}
            onChange={(e) => handleChange('property_type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="flat">Flat</option>
            <option value="house">House</option>
          </select>
        </div>

        <div className="filter-section">
          <label className="filter-label">Bedrooms</label>
          <div className="bedroom-filter">
            {[1, 2, 3].map(bed => (
              <button
                key={bed}
                className={`bedroom-btn ${(filters.bedrooms || []).includes(bed) ? 'active' : ''}`}
                onClick={() => handleBedroomToggle(bed)}
              >
                {bed} BHK
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-label">Budget</label>
          <div className="budget-inputs">
            <input
              type="number"
              className="form-input"
              placeholder="Min"
              value={filters.min_price || ''}
              onChange={(e) => handleChange('min_price', e.target.value)}
            />
            <span>to</span>
            <input
              type="number"
              className="form-input"
              placeholder="Max"
              value={filters.max_price || ''}
              onChange={(e) => handleChange('max_price', e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-secondary clear-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </aside>
      
      {isOpen && <div className="filter-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}

export default FilterPanel;
