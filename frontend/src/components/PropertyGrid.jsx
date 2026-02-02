import PropertyCard from './PropertyCard';
import './PropertyGrid.css';

function PropertyGrid({ properties, loading }) {
  if (loading) {
    return (
      <div className="property-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="property-skeleton card">
            <div className="skeleton-image" />
            <div className="skeleton-content">
              <div className="skeleton-line large" />
              <div className="skeleton-line medium" />
              <div className="skeleton-line small" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="no-results">
        <h3>No properties found</h3>
        <p>Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="property-grid">
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

export default PropertyGrid;
