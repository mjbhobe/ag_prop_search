import { Link } from 'react-router-dom';
import { FiMapPin, FiHome, FiMaximize2 } from 'react-icons/fi';
import { formatPrice, formatArea } from '../services/api';
import './PropertyCard.css';

function PropertyCard({ property }) {
  const {
    id,
    title,
    listing_type,
    property_type,
    bedrooms,
    bathrooms,
    area_sqft,
    price,
    price_unit,
    image_url,
    is_furnished,
    locality
  } = property;

  return (
    <Link to={`/property/${id}`} className="property-card card">
      <div className="property-image">
        <img 
          src={image_url || 'https://picsum.photos/400/300'} 
          alt={title}
          loading="lazy"
        />
        <div className="property-badges">
          <span className={`badge badge-${listing_type}`}>
            {listing_type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
          <span className={`badge badge-${property_type}`}>
            {property_type === 'flat' ? 'Flat' : 'House'}
          </span>
        </div>
      </div>
      
      <div className="property-content">
        <div className="property-price">
          {formatPrice(price, price_unit)}
        </div>
        
        <h3 className="property-title">{title}</h3>
        
        <div className="property-location">
          <FiMapPin size={14} />
          <span>{locality.name}, {locality.city.name}</span>
        </div>
        
        <div className="property-features">
          <div className="feature">
            <FiHome size={14} />
            <span>{bedrooms} BHK</span>
          </div>
          <div className="feature">
            <span>{bathrooms} Bath</span>
          </div>
          <div className="feature">
            <FiMaximize2 size={14} />
            <span>{formatArea(area_sqft)}</span>
          </div>
        </div>
        
        {is_furnished && (
          <div className="property-tag">Furnished</div>
        )}
      </div>
    </Link>
  );
}

export default PropertyCard;
