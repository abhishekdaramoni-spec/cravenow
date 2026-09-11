// ============================================
// CraveNow — Location Context
// ============================================
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { DeliveryLocation, Address } from '@/types';
import { StorageService } from '@/services/storageService';
import { requestCurrentLocation } from '@/services/locationService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

interface LocationContextType {
  currentLocation: DeliveryLocation;
  setLocation: (location: DeliveryLocation) => void;
  isDetectingLocation: boolean;
  locationError: string | null;
  clearLocationError: () => void;
  detectCurrentLocation: () => Promise<DeliveryLocation | null>;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  savedAddresses: Address[];
  refreshSavedAddresses: () => void;
  saveNewAddressAndSetLocation: (label: string, fullAddress: string) => Address;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const userId = user?.id || 'guest';

  // Initialize from storage
  const [currentLocation, setCurrentLocationState] = useState<DeliveryLocation>(() => {
    return StorageService.getActiveLocation(userId);
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(() => {
    return StorageService.getUserAddresses(userId);
  });

  // Re-sync when user changes (e.g. login/logout or account switch)
  useEffect(() => {
    const active = StorageService.getActiveLocation(userId);
    setCurrentLocationState(active);
    setSavedAddresses(StorageService.getUserAddresses(userId));
    setLocationError(null);
  }, [userId]);

  // Listen for storage events across tabs or components
  useEffect(() => {
    const handleLocationChange = (e: Event) => {
      const customEvent = e as CustomEvent<DeliveryLocation>;
      if (customEvent.detail) {
        setCurrentLocationState(customEvent.detail);
      }
    };
    window.addEventListener('cravenow_location_changed', handleLocationChange);
    return () => window.removeEventListener('cravenow_location_changed', handleLocationChange);
  }, []);

  const setLocation = useCallback(
    (newLocation: DeliveryLocation) => {
      setCurrentLocationState(newLocation);
      StorageService.setActiveLocation(newLocation, userId);
      setLocationError(null);
      showToast(`Delivering to ${newLocation.locality || newLocation.city}`, 'success');
    },
    [userId, showToast]
  );

  const clearLocationError = useCallback(() => {
    setLocationError(null);
  }, []);

  const refreshSavedAddresses = useCallback(() => {
    const list = StorageService.getUserAddresses(userId);
    setSavedAddresses(list);
  }, [userId]);

  const saveNewAddressAndSetLocation = useCallback(
    (label: string, fullAddress: string): Address => {
      const newAddr: Address = {
        id: `addr-${Date.now()}`,
        user_id: userId,
        label: label.trim() || 'Home',
        full_address: fullAddress.trim(),
        lat: currentLocation.lat || 12.9352,
        lng: currentLocation.lng || 77.6245,
        is_default: false,
        created_at: new Date().toISOString(),
      };
      StorageService.saveAddress(userId, newAddr);
      refreshSavedAddresses();

      const newLoc: DeliveryLocation = {
        id: newAddr.id,
        address: newAddr.full_address,
        locality: newAddr.label,
        city: 'Bangalore',
        lat: newAddr.lat,
        lng: newAddr.lng,
        source: 'saved',
        label: newAddr.label,
      };
      setLocation(newLoc);
      return newAddr;
    },
    [userId, currentLocation.lat, currentLocation.lng, refreshSavedAddresses, setLocation]
  );

  const detectCurrentLocation = useCallback(async (): Promise<DeliveryLocation | null> => {
    setIsDetectingLocation(true);
    setLocationError(null);

    try {
      const result = await requestCurrentLocation();
      if (result.success && result.location) {
        setLocation(result.location);
        setIsDetectingLocation(false);
        return result.location;
      } else {
        const errorMsg = result.error || 'Failed to detect current location. Please select manually.';
        setLocationError(errorMsg);
        showToast(errorMsg, 'error');
        setIsDetectingLocation(false);
        return null;
      }
    } catch {
      const fallbackMsg = 'Location detection unavailable. Please select your locality manually.';
      setLocationError(fallbackMsg);
      showToast(fallbackMsg, 'error');
      setIsDetectingLocation(false);
      return null;
    }
  }, [setLocation, showToast]);

  const openLocationModal = useCallback(() => {
    setLocationError(null);
    setIsLocationModalOpen(true);
  }, []);

  const closeLocationModal = useCallback(() => {
    setIsLocationModalOpen(false);
    setLocationError(null);
  }, []);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setLocation,
        isDetectingLocation,
        locationError,
        clearLocationError,
        detectCurrentLocation,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal,
        savedAddresses,
        refreshSavedAddresses,
        saveNewAddressAndSetLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
