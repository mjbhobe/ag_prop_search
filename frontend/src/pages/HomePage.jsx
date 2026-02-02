import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import PropertyGrid from '../components/PropertyGrid';
import { searchProperties } from '../services/api';
import './HomePage.css';

function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProperties() {
      try {
        const data = await searchProperties({ limit: 6 });
        setProperties(data.items);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedProperties();
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">
            Find Your Perfect Home in <span>India</span>
          </h1>
          <p className="hero-subtitle">
            Search properties for rent or sale in Mumbai and Bangalore
          </p>
          <div className="hero-search">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Properties</h2>
            <p>Discover the latest listings in top locations</p>
          </div>
          <PropertyGrid properties={properties} loading={loading} />
        </div>
      </section>

      <section className="cities-section">
        <div className="container">
          <div className="section-header">
            <h2>Explore by City</h2>
            <p>Find properties in India's top metropolitan cities</p>
          </div>
          <div className="cities-grid">
            <a href="/search?city_id=1" className="city-card">
              <img 
                src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop" 
                alt="Mumbai"
              />
              <div className="city-overlay">
                <h3>Mumbai</h3>
                <p>Maharashtra</p>
              </div>
            </a>
            <a href="/search?city_id=2" className="city-card">
              <img 
                src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&h=400&fit=crop" 
                alt="Bangalore"
              />
              <div className="city-overlay">
                <h3>Bangalore</h3>
                <p>Karnataka</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
