// ============================================
// CraveNow — Location Service & Geolocation
// ============================================
import type { DeliveryLocation, Address } from '@/types';

export interface PopularLocality {
  id: string;
  name: string;
  city: string;
  state: string;
  postal_code?: string;
  lat: number;
  lng: number;
  landmark?: string;
}

// Curated top food-delivery localities across Indian metropolitan areas
export const POPULAR_LOCALITIES: PopularLocality[] = [
  // --- Bangalore ---
  {
    id: 'blr-koramangala',
    name: 'Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    postal_code: '560034',
    lat: 12.9352,
    lng: 77.6245,
    landmark: 'Sony World Junction / 5th Block',
  },
  {
    id: 'blr-indiranagar',
    name: 'Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    postal_code: '560038',
    lat: 12.9784,
    lng: 77.6408,
    landmark: '100ft Road / 12th Main',
  },
  {
    id: 'blr-hsr',
    name: 'HSR Layout',
    city: 'Bangalore',
    state: 'Karnataka',
    postal_code: '560102',
    lat: 12.9121,
    lng: 77.6446,
    landmark: 'Sector 3 / 27th Main',
  },
  {
    id: 'blr-whitefield',
    name: 'Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    postal_code: '560066',
    lat: 12.9698,
    lng: 77.7499,
    landmark: 'ITPL Main Road',
  },
  {
    id: 'blr-bellandur',
    name: 'Bellandur',
    city: 'Bangalore',
    state: 'Karnataka',
    postal_code: '560103',
    lat: 12.9304,
    lng: 77.6784,
    landmark: 'Ecospace / Outer Ring Road',
  },
  {
    id: 'blr-jayanagar',
    name: 'Jayanagar',
    city: 'Bangalore',
    state: 'Karnataka',
    postal_code: '560041',
    lat: 12.9308,
    lng: 77.5838,
    landmark: '4th Block Shopping Complex',
  },
  {
    id: 'blr-mgroad',
    name: 'MG Road / CBD',
    city: 'Bangalore',
    state: 'Karnataka',
    postal_code: '560001',
    lat: 12.9756,
    lng: 77.6066,
    landmark: 'Brigade Road / Church Street',
  },

  // --- Mumbai ---
  {
    id: 'mum-bandra',
    name: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '400050',
    lat: 19.0596,
    lng: 72.8295,
    landmark: 'Hill Road / Pali Hill',
  },
  {
    id: 'mum-andheri',
    name: 'Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '400058',
    lat: 19.1363,
    lng: 72.8277,
    landmark: 'Lokhandwala Complex',
  },
  {
    id: 'mum-juhu',
    name: 'Juhu',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '400049',
    lat: 19.1075,
    lng: 72.8263,
    landmark: 'Juhu Tara Road',
  },
  {
    id: 'mum-powai',
    name: 'Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '400076',
    lat: 19.1176,
    lng: 72.906,
    landmark: 'Hiranandani Gardens',
  },
  {
    id: 'mum-lowerparel',
    name: 'Lower Parel',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '400013',
    lat: 18.9953,
    lng: 72.8315,
    landmark: 'High Street Phoenix',
  },

  // --- Delhi NCR ---
  {
    id: 'del-cp',
    name: 'Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    postal_code: '110001',
    lat: 28.6315,
    lng: 77.2167,
    landmark: 'Inner Circle',
  },
  {
    id: 'del-cyberhub',
    name: 'DLF Cyber Hub',
    city: 'Gurgaon',
    state: 'Haryana',
    postal_code: '122002',
    lat: 28.495,
    lng: 77.0895,
    landmark: 'Cyber City, DLF Phase 2',
  },
  {
    id: 'del-hauzkhas',
    name: 'Hauz Khas',
    city: 'New Delhi',
    state: 'Delhi',
    postal_code: '110016',
    lat: 28.5494,
    lng: 77.2001,
    landmark: 'HKV & Aurobindo Market',
  },
  {
    id: 'del-noida',
    name: 'Sector 18',
    city: 'Noida',
    state: 'Uttar Pradesh',
    postal_code: '201301',
    lat: 28.5708,
    lng: 77.3271,
    landmark: 'Atta Market / Mall of India',
  },

  // --- Hyderabad ---
  {
    id: 'hyd-hitech',
    name: 'Hitech City',
    city: 'Hyderabad',
    state: 'Telangana',
    postal_code: '500081',
    lat: 17.4435,
    lng: 78.3772,
    landmark: 'Cyber Towers / Mindspace',
  },
  {
    id: 'hyd-jubilee',
    name: 'Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    postal_code: '500033',
    lat: 17.4319,
    lng: 78.4073,
    landmark: 'Road No. 36 / 45',
  },
  {
    id: 'hyd-gachibowli',
    name: 'Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    postal_code: '500032',
    lat: 17.4401,
    lng: 78.3489,
    landmark: 'Financial District',
  },

  // --- Pune ---
  {
    id: 'pun-koregaon',
    name: 'Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    postal_code: '411001',
    lat: 18.5362,
    lng: 73.894,
    landmark: 'North Main Road',
  },
  {
    id: 'pun-baner',
    name: 'Baner',
    city: 'Pune',
    state: 'Maharashtra',
    postal_code: '411045',
    lat: 18.559,
    lng: 73.7868,
    landmark: 'Baner Road / Balewadi High St',
  },
];

export interface GeolocationResult {
  success: boolean;
  location?: DeliveryLocation;
  error?: string;
  errorCode?: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'NOT_SUPPORTED' | 'UNKNOWN';
}

/**
 * Calculates Haversine distance in kilometers between two geo coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the closest popular locality to a given set of coordinates
 */
export function findClosestLocality(lat: number, lng: number): PopularLocality {
  let closest = POPULAR_LOCALITIES[0];
  let minDistance = Infinity;

  for (const locality of POPULAR_LOCALITIES) {
    const dist = calculateDistanceKm(lat, lng, locality.lat, locality.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = locality;
    }
  }

  return closest;
}

/**
 * Reverse geocodes coordinates using OpenStreetMap Nominatim with safe fallback
 */
export async function reverseGeocodeCoordinates(lat: number, lng: number): Promise<DeliveryLocation> {
  const closest = findClosestLocality(lat, lng);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'CraveNow-FoodApp/1.0',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const localityName =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.commercial ||
        addr.road ||
        closest.name;

      const cityName =
        addr.city ||
        addr.town ||
        addr.state_district ||
        closest.city;

      const stateName = addr.state || closest.state;
      const postalCode = addr.postcode || closest.postal_code || '';

      const fullAddress =
        data.display_name ||
        `${localityName}, ${cityName}, ${stateName} ${postalCode}`.trim();

      return {
        id: `loc-gps-${Date.now()}`,
        locality: localityName,
        city: cityName,
        state: stateName,
        postal_code: postalCode,
        address: fullAddress,
        lat,
        lng,
        source: 'gps',
        label: 'Current Location',
      };
    }
  } catch {
    // Network failure, timeout, or blocked — fall back gracefully to closest curated locality
  }

  // Graceful fallback with coordinates and nearest known hub
  return {
    id: `loc-gps-${Date.now()}`,
    locality: closest.name,
    city: closest.city,
    state: closest.state,
    postal_code: closest.postal_code,
    address: `${closest.name}, ${closest.city} (GPS Detected)`,
    lat,
    lng,
    source: 'gps',
    label: 'Current Location',
  };
}

/**
 * Requests browser geolocation with complete error handling
 */
export async function requestCurrentLocation(): Promise<GeolocationResult> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return {
      success: false,
      error: 'Geolocation is not supported by your browser.',
      errorCode: 'NOT_SUPPORTED',
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const location = await reverseGeocodeCoordinates(lat, lng);
          resolve({
            success: true,
            location,
          });
        } catch {
          // Never reject, return nearest fallback
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const closest = findClosestLocality(lat, lng);
          resolve({
            success: true,
            location: {
              id: `loc-gps-${Date.now()}`,
              locality: closest.name,
              city: closest.city,
              state: closest.state,
              postal_code: closest.postal_code,
              address: `${closest.name}, ${closest.city}`,
              lat,
              lng,
              source: 'gps',
              label: 'Current Location',
            },
          });
        }
      },
      (error) => {
        let userMessage = 'Unable to retrieve your current location.';
        let code: GeolocationResult['errorCode'] = 'UNKNOWN';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            userMessage = 'Location permission was denied. Please enable location access in browser settings or choose a locality below.';
            code = 'PERMISSION_DENIED';
            break;
          case error.POSITION_UNAVAILABLE:
            userMessage = 'Location information is currently unavailable. Please pick a locality from the list below.';
            code = 'POSITION_UNAVAILABLE';
            break;
          case error.TIMEOUT:
            userMessage = 'Location detection timed out. Please try again or select your delivery area.';
            code = 'TIMEOUT';
            break;
          default:
            userMessage = error.message || 'An unexpected error occurred while requesting your location.';
            code = 'UNKNOWN';
        }

        resolve({
          success: false,
          error: userMessage,
          errorCode: code,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Searches across curated localities and user saved addresses
 */
export function searchLocalities(
  query: string,
  savedAddresses: Address[] = []
): DeliveryLocation[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const results: DeliveryLocation[] = [];

  // Match saved addresses first
  savedAddresses.forEach((addr) => {
    const fullMatch = addr.full_address.toLowerCase().includes(clean);
    const labelMatch = addr.label.toLowerCase().includes(clean);
    if (fullMatch || labelMatch) {
      results.push({
        id: addr.id,
        address: addr.full_address,
        locality: addr.label || 'Saved Address',
        city: extractCityFromAddress(addr.full_address),
        lat: addr.lat,
        lng: addr.lng,
        source: 'saved',
        label: addr.label,
      });
    }
  });

  // Match popular localities
  POPULAR_LOCALITIES.forEach((loc) => {
    const nameMatch = loc.name.toLowerCase().includes(clean);
    const cityMatch = loc.city.toLowerCase().includes(clean);
    const landmarkMatch = loc.landmark ? loc.landmark.toLowerCase().includes(clean) : false;

    if (nameMatch || cityMatch || landmarkMatch) {
      results.push({
        id: loc.id,
        locality: loc.name,
        city: loc.city,
        state: loc.state,
        postal_code: loc.postal_code,
        address: `${loc.name}, ${loc.city}${loc.postal_code ? ' - ' + loc.postal_code : ''}`,
        lat: loc.lat,
        lng: loc.lng,
        source: 'popular',
        label: loc.landmark,
      });
    }
  });

  return results;
}

/**
 * Extracts city name from address string
 */
function extractCityFromAddress(address: string): string {
  const cities = ['Bangalore', 'Bengaluru', 'Mumbai', 'Delhi', 'Gurgaon', 'Noida', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];
  const lower = address.toLowerCase();
  for (const c of cities) {
    if (lower.includes(c.toLowerCase())) return c;
  }
  return 'Bangalore';
}
