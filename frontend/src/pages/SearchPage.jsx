import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import PropertyGrid from '../components/PropertyGrid';
import { searchProperties } from '../services/api';
import './SearchPage.css';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Parse filters from URL params
  const getFiltersFromParams = useCallback(() => {
    const bedroomsParam = searchParams.getAll('bedrooms');
    return {
      city_id: searchParams.get('city_id') || '',
      locality_id: searchParams.get('locality_id') || '',
      listing_type: searchParams.get('listing_type') || 'rent',
      property_type: searchParams.get('property_type') || '',
      min_price: searchParams.get('min_price') || '',
      max_price: searchParams.get('max_price') || '',
      bedrooms: bedroomsParam.length > 0 ? bedroomsParam.map(Number) : [],
      page: parseInt(searchParams.get('page')) || 1
    };
  }, [searchParams]);

  const [filters, setFilters] = useState(getFiltersFromParams);

  // Sync filters with URL params when they change
  useEffect(() => {
    setFilters(getFiltersFromParams());
  }, [getFiltersFromParams]);

  // Load properties when filters change
  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
        const data = await searchProperties(filters);
        setProperties(data.items);
        setPagination({
          total: data.total,
          page: data.page,
          totalPages: data.total_pages
        });
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, [filters]);

  // Update URL when filters change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (value) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    handleFilterChange({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="search-page">
      <div className="container search-layout">
        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
        
        <main className="search-results">
          <div className="results-header">
            <h1>
              {filters.listing_type === 'rent' ? 'Properties for Rent' : 'Properties for Sale'}
            </h1>
            <p className="results-count">
              {pagination.total} {pagination.total === 1 ? 'property' : 'properties'} found
            </p>
          </div>

          <PropertyGrid properties={properties} loading={loading} />

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-secondary"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default SearchPage;
