import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Cities
export async function getCities() {
  const response = await api.get('/cities');
  return response.data;
}

export async function getCity(cityId) {
  const response = await api.get(`/cities/${cityId}`);
  return response.data;
}

// Localities
export async function getLocalitiesByCity(cityId) {
  const response = await api.get(`/cities/${cityId}/localities`);
  return response.data;
}

// Properties
export async function searchProperties(params = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.city_id) queryParams.append('city_id', params.city_id);
  if (params.locality_id) queryParams.append('locality_id', params.locality_id);
  if (params.listing_type) queryParams.append('listing_type', params.listing_type);
  if (params.property_type) queryParams.append('property_type', params.property_type);
  if (params.min_price) queryParams.append('min_price', params.min_price);
  if (params.max_price) queryParams.append('max_price', params.max_price);
  if (params.bedrooms && params.bedrooms.length > 0) {
    params.bedrooms.forEach(b => queryParams.append('bedrooms', b));
  }
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  
  const response = await api.get(`/properties?${queryParams.toString()}`);
  return response.data;
}

export async function getProperty(propertyId) {
  const response = await api.get(`/properties/${propertyId}`);
  return response.data;
}

// Utility function to format price
export function formatPrice(price, priceUnit) {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });
  
  const formatted = formatter.format(price);
  
  if (priceUnit === 'per_month') {
    return `${formatted}/month`;
  }
  return formatted;
}

// Format area
export function formatArea(sqft) {
  return `${sqft.toLocaleString('en-IN')} sq.ft`;
}
