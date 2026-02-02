import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { getCities, getLocalitiesByCity } from '../services/api';
import './SearchBar.css';

function SearchBar({ initialValues = {} }) {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    cityId: initialValues.cityId || '',
    localityId: initialValues.localityId || '',
    listingType: initialValues.listingType || 'rent',
    minPrice: initialValues.minPrice || '',
    maxPrice: initialValues.maxPrice || '',
    bedrooms: initialValues.bedrooms || [],
    propertyType: initialValues.propertyType || ''
  });

  // Load cities on mount
  useEffect(() => {
    async function loadCities() {
      try {
        const data = await getCities();
        setCities(data);
      } catch (error) {
        console.error('Error loading cities:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCities();
  }, []);

  // Load localities when city changes
  useEffect(() => {
    async function loadLocalities() {
      if (formData.cityId) {
        try {
          const data = await getLocalitiesByCity(formData.cityId);
          setLocalities(data);
        } catch (error) {
          console.error('Error loading localities:', error);
        }
      } else {
        setLocalities([]);
      }
    }
    loadLocalities();
  }, [formData.cityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Reset locality when city changes
      if (name === 'cityId') {
        updated.localityId = '';
      }
      return updated;
    });
  };

  const handleBedroomChange = (bedroom) => {
    setFormData(prev => {
      const bedrooms = prev.bedrooms.includes(bedroom)
        ? prev.bedrooms.filter(b => b !== bedroom)
        : [...prev.bedrooms, bedroom];
      return { ...prev, bedrooms };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (formData.cityId) params.set('city_id', formData.cityId);
    if (formData.localityId) params.set('locality_id', formData.localityId);
    if (formData.listingType) params.set('listing_type', formData.listingType);
    if (formData.propertyType) params.set('property_type', formData.propertyType);
    if (formData.minPrice) params.set('min_price', formData.minPrice);
    if (formData.maxPrice) params.set('max_price', formData.maxPrice);
    if (formData.bedrooms.length > 0) {
      formData.bedrooms.forEach(b => params.append('bedrooms', b));
    }
    
    navigate(`/search?${params.toString()}`);
  };

  if (loading) {
    return <div className="search-bar-skeleton" />;
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-tabs">
        <button
          type="button"
          className={`search-tab ${formData.listingType === 'rent' ? 'active' : ''}`}
          onClick={() => setFormData(prev => ({ ...prev, listingType: 'rent' }))}
        >
          Rent
        </button>
        <button
          type="button"
          className={`search-tab ${formData.listingType === 'buy' ? 'active' : ''}`}
          onClick={() => setFormData(prev => ({ ...prev, listingType: 'buy' }))}
        >
          Buy
        </button>
      </div>

      <div className="search-fields">
        <div className="search-field">
          <FiMapPin className="field-icon" />
          <select
            name="cityId"
            value={formData.cityId}
            onChange={handleChange}
            className="search-select"
          >
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>

        <div className="search-field">
          <select
            name="localityId"
            value={formData.localityId}
            onChange={handleChange}
            className="search-select"
            disabled={!formData.cityId}
          >
            <option value="">All Localities</option>
            {localities.map(locality => (
              <option key={locality.id} value={locality.id}>{locality.name}</option>
            ))}
          </select>
        </div>

        <div className="search-field">
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="search-select"
          >
            <option value="">All Types</option>
            <option value="flat">Flat</option>
            <option value="house">House</option>
          </select>
        </div>

        <div className="search-field price-field">
          <input
            type="number"
            name="minPrice"
            value={formData.minPrice}
            onChange={handleChange}
            placeholder="Min Budget"
            className="search-input"
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            name="maxPrice"
            value={formData.maxPrice}
            onChange={handleChange}
            placeholder="Max Budget"
            className="search-input"
          />
        </div>

        <div className="bedroom-options">
          {[1, 2, 3].map(bed => (
            <button
              key={bed}
              type="button"
              className={`bedroom-btn ${formData.bedrooms.includes(bed) ? 'active' : ''}`}
              onClick={() => handleBedroomChange(bed)}
            >
              {bed} BHK
            </button>
          ))}
        </div>

        <button type="submit" className="btn btn-primary search-btn">
          <FiSearch size={18} />
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
