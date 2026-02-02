import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiArrowLeft, FiMapPin, FiHome, FiMaximize2, FiCalendar, 
  FiLayers, FiCheckCircle, FiXCircle 
} from 'react-icons/fi';
import { getProperty, formatPrice, formatArea } from '../services/api';
import './PropertyDetailPage.css';

function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProperty() {
      try {
        const data = await getProperty(id);
        setProperty(data);
      } catch (err) {
        setError('Property not found');
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="error-page container">
        <h2>Property Not Found</h2>
        <p>The property you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn btn-primary">Go to Home</Link>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      <div className="container">
        <Link to="/search" className="back-link">
          <FiArrowLeft size={18} />
          Back to Search
        </Link>

        <div className="property-detail-grid">
          <div className="property-main">
            <div className="property-image-large">
              <img 
                src={property.image_url || 'https://picsum.photos/800/600'} 
                alt={property.title}
              />
              <div className="property-badges">
                <span className={`badge badge-${property.listing_type}`}>
                  {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
                <span className={`badge badge-${property.property_type}`}>
                  {property.property_type === 'flat' ? 'Flat' : 'House'}
                </span>
              </div>
            </div>

            <div className="property-info-card card">
              <div className="property-header">
                <div>
                  <h1 className="property-title">{property.title}</h1>
                  <p className="property-address">
                    <FiMapPin size={16} />
                    {property.address}
                  </p>
                </div>
                <div className="property-price-large">
                  {formatPrice(property.price, property.price_unit)}
                </div>
              </div>

              <div className="property-features-grid">
                <div className="feature-item">
                  <FiHome size={20} />
                  <span className="feature-value">{property.bedrooms} BHK</span>
                  <span className="feature-label">Bedrooms</span>
                </div>
                <div className="feature-item">
                  <span className="feature-value">{property.bathrooms}</span>
                  <span className="feature-label">Bathrooms</span>
                </div>
                <div className="feature-item">
                  <FiMaximize2 size={20} />
                  <span className="feature-value">{formatArea(property.area_sqft)}</span>
                  <span className="feature-label">Area</span>
                </div>
                {property.floor_number && (
                  <div className="feature-item">
                    <FiLayers size={20} />
                    <span className="feature-value">{property.floor_number}/{property.total_floors}</span>
                    <span className="feature-label">Floor</span>
                  </div>
                )}
              </div>

              <div className="property-description">
                <h3>Description</h3>
                <p>{property.description}</p>
              </div>

              <div className="property-amenities">
                <h3>Details</h3>
                <div className="amenity-list">
                  <div className="amenity-item">
                    {property.is_furnished ? (
                      <><FiCheckCircle className="check" /> Furnished</>
                    ) : (
                      <><FiXCircle className="cross" /> Unfurnished</>
                    )}
                  </div>
                  <div className="amenity-item">
                    <FiCalendar />
                    Listed on {new Date(property.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="property-sidebar">
            <div className="contact-card card">
              <h3>Interested in this property?</h3>
              <p>Contact us for more details or to schedule a viewing.</p>
              <button className="btn btn-primary btn-lg">
                Contact Agent
              </button>
              <button className="btn btn-secondary">
                Schedule Visit
              </button>
            </div>

            <div className="location-card card">
              <h3>Location</h3>
              <p className="location-info">
                <strong>{property.locality.name}</strong><br />
                {property.locality.city.name}, {property.locality.city.state}<br />
                PIN: {property.locality.pincode}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailPage;
