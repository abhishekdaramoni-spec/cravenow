// ============================================
// CraveNow — Delivery Location Selection Modal
// ============================================
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocationContext } from '@/contexts/LocationContext';
import { POPULAR_LOCALITIES, searchLocalities, type PopularLocality } from '@/services/locationService';
import type { DeliveryLocation, Address } from '@/types';

export function LocationModal() {
  const {
    currentLocation,
    setLocation,
    isDetectingLocation,
    locationError,
    clearLocationError,
    detectCurrentLocation,
    isLocationModalOpen,
    closeLocationModal,
    savedAddresses,
    saveNewAddressAndSetLocation,
  } = useLocationContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCityTab, setActiveCityTab] = useState<string>('Bangalore');
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [manualLocality, setManualLocality] = useState('');
  const [manualLabel, setManualLabel] = useState<'Home' | 'Work' | 'Other'>('Home');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (isLocationModalOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery('');
      setShowManualForm(false);
      clearLocationError();
    }
  }, [isLocationModalOpen, clearLocationError]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isLocationModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeLocationModal();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isLocationModalOpen, closeLocationModal]);

  // Cities list from curated localities
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    POPULAR_LOCALITIES.forEach((loc) => set.add(loc.city));
    return Array.from(set);
  }, []);

  // Filtered popular localities for active city
  const cityLocalities = useMemo(() => {
    return POPULAR_LOCALITIES.filter((loc) => loc.city.toLowerCase() === activeCityTab.toLowerCase());
  }, [activeCityTab]);

  // Dynamic search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchLocalities(searchQuery, savedAddresses);
  }, [searchQuery, savedAddresses]);

  if (!isLocationModalOpen) return null;

  // Handle selecting a popular locality
  const handleSelectPopularLocality = (loc: PopularLocality) => {
    const deliveryLoc: DeliveryLocation = {
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
    };
    setLocation(deliveryLoc);
    closeLocationModal();
  };

  // Handle selecting a saved address
  const handleSelectSavedAddress = (addr: Address) => {
    const deliveryLoc: DeliveryLocation = {
      id: addr.id,
      locality: addr.label || 'Saved Address',
      city: 'Bangalore',
      address: addr.full_address,
      lat: addr.lat,
      lng: addr.lng,
      source: 'saved',
      label: addr.label,
    };
    setLocation(deliveryLoc);
    closeLocationModal();
  };

  // Handle GPS detection
  const handleUseCurrentLocation = async () => {
    const loc = await detectCurrentLocation();
    if (loc) {
      closeLocationModal();
    }
  };

  // Handle manual address submission
  const handleSaveManualAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAddress.trim()) return;

    const fullAddr = manualLocality.trim()
      ? `${manualAddress.trim()}, ${manualLocality.trim()}`
      : manualAddress.trim();

    saveNewAddressAndSetLocation(manualLabel, fullAddr);
    closeLocationModal();
  };

  // Check if a locality is currently active
  const isCurrentlyActive = (name: string, city?: string) => {
    if (currentLocation.locality?.toLowerCase() === name.toLowerCase()) return true;
    if (city && currentLocation.city?.toLowerCase() === city.toLowerCase() && currentLocation.address?.toLowerCase().includes(name.toLowerCase())) {
      return true;
    }
    return false;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLocationModal();
      }}
    >
      <div className="relative w-full max-w-lg bg-[#181716] border border-[#2e2c2a] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#e6e1df]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#2a2826]">
          <div>
            <h2 id="location-modal-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f36334] text-[22px]">location_on</span>
              Delivery Location
            </h2>
            <p className="text-xs text-[#a88a81] mt-0.5">
              Select or search your area for accurate delivery time & menu
            </p>
          </div>
          <button
            onClick={closeLocationModal}
            className="w-9 h-9 rounded-full bg-[#232120] hover:bg-[#2e2c2a] text-[#a88a81] hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-6 py-4 space-y-5 flex-1 custom-scrollbar">
          {/* Geolocation Button */}
          <div className="space-y-2">
            <button
              onClick={handleUseCurrentLocation}
              disabled={isDetectingLocation}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                isDetectingLocation
                  ? 'bg-[#24211e] border-[#f36334]/50 cursor-wait'
                  : 'bg-[#201e1c] hover:bg-[#262422] border-[#f36334]/30 hover:border-[#f36334] text-white active:scale-[0.99]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f36334]/15 text-[#f36334] flex items-center justify-center">
                  {isDetectingLocation ? (
                    <div className="w-5 h-5 border-2 border-[#f36334] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-[22px]">my_location</span>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-bold text-[#f36334] flex items-center gap-1.5">
                    {isDetectingLocation ? 'Detecting current location...' : 'Use my current location'}
                  </div>
                  <div className="text-[11px] text-[#a88a81]">
                    {isDetectingLocation ? 'Accessing device GPS coordinates...' : 'Using browser GPS for pinpoint accuracy'}
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#f36334] text-[20px]">
                chevron_right
              </span>
            </button>

            {/* Location Error Warning if permission denied or timeout */}
            {locationError && (
              <div className="p-3 rounded-xl bg-[#e02e2e]/10 border border-[#e02e2e]/30 text-[#fca5a5] text-xs flex items-start gap-2.5 animate-fadeIn">
                <span className="material-symbols-outlined text-[18px] text-[#ef4444] shrink-0 mt-0.5">
                  error
                </span>
                <div className="flex-1">
                  <span className="font-semibold block mb-0.5">Location Access Notice</span>
                  <span>{locationError}</span>
                </div>
                <button
                  onClick={clearLocationError}
                  className="text-[#fca5a5] hover:text-white shrink-0 p-0.5"
                  aria-label="Dismiss error"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#a88a81] text-[20px]">
              search
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, landmark, street, or apartment..."
              className="w-full bg-[#141312] text-white placeholder:text-[#6b625b] pl-10 pr-10 py-3 rounded-2xl text-xs sm:text-sm border border-[#2f2d2a] focus:outline-none focus:border-[#f36334] focus:ring-1 focus:ring-[#f36334] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#2a2826] text-[#a88a81] hover:text-white flex items-center justify-center text-xs"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>

          {/* Search Results view */}
          {searchQuery.trim().length > 0 ? (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#a88a81] block">
                Matching Locations ({searchResults.length})
              </span>
              {searchResults.length > 0 ? (
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {searchResults.map((result) => {
                    const active = isCurrentlyActive(result.locality, result.city);
                    return (
                      <button
                        key={`${result.source}-${result.id || result.locality}`}
                        onClick={() => {
                          setLocation(result);
                          closeLocationModal();
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors border ${
                          active
                            ? 'bg-[#f36334]/15 border-[#f36334]/40 text-white'
                            : 'bg-[#1c1b1a] hover:bg-[#232120] border-transparent text-[#e6e1df]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 truncate">
                          <span className="material-symbols-outlined text-[#f36334] text-[18px] shrink-0 mt-0.5">
                            {result.source === 'saved' ? 'bookmark' : 'location_on'}
                          </span>
                          <div className="truncate">
                            <div className="text-xs sm:text-sm font-semibold truncate flex items-center gap-1.5">
                              {result.locality}
                              {result.label && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2a2826] text-[#ffba49] font-medium">
                                  {result.label}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#a88a81] truncate mt-0.5">
                              {result.address}
                            </div>
                          </div>
                        </div>
                        {active && (
                          <span className="material-symbols-outlined text-[#f36334] text-[18px] shrink-0 ml-2">
                            check_circle
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#1c1b1a] text-center space-y-2">
                  <p className="text-xs text-[#a88a81]">
                    No pre-saved matches found for &quot;{searchQuery}&quot;.
                  </p>
                  <button
                    onClick={() => {
                      const manualLoc: DeliveryLocation = {
                        id: `loc-custom-${Date.now()}`,
                        locality: searchQuery.trim(),
                        city: 'Bangalore',
                        address: searchQuery.trim(),
                        source: 'manual',
                        label: 'Custom Address',
                      };
                      setLocation(manualLoc);
                      closeLocationModal();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#f36334] hover:bg-[#ff7547] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_location</span>
                    Deliver to &quot;{searchQuery}&quot;
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Saved Addresses Section */}
              {savedAddresses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#a88a81]">
                      Saved Addresses
                    </span>
                    <span className="text-[11px] text-[#f36334] font-medium">
                      {savedAddresses.length} saved
                    </span>
                  </div>
                  <div className="space-y-2">
                    {savedAddresses.map((addr) => {
                      const active =
                        currentLocation.id === addr.id ||
                        currentLocation.address?.toLowerCase() === addr.full_address.toLowerCase();

                      const icon =
                        addr.label.toLowerCase() === 'home'
                          ? 'home'
                          : addr.label.toLowerCase() === 'work'
                          ? 'work'
                          : 'location_on';

                      return (
                        <button
                          key={addr.id}
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-colors border ${
                            active
                              ? 'bg-[#f36334]/15 border-[#f36334]/50 text-white'
                              : 'bg-[#1c1b1a] hover:bg-[#232120] border-[#292725] text-[#e6e1df]'
                          }`}
                        >
                          <div className="flex items-start gap-3 truncate">
                            <div className="w-8 h-8 rounded-xl bg-[#292725] text-[#f36334] flex items-center justify-center shrink-0 mt-0.5">
                              <span className="material-symbols-outlined text-[18px]">{icon}</span>
                            </div>
                            <div className="truncate">
                              <div className="text-xs sm:text-sm font-bold flex items-center gap-2">
                                <span>{addr.label}</span>
                                {addr.is_default && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#f36334]/20 text-[#f36334] font-semibold">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#a88a81] truncate mt-0.5">
                                {addr.full_address}
                              </div>
                            </div>
                          </div>
                          {active && (
                            <span className="material-symbols-outlined text-[#f36334] text-[20px] shrink-0 ml-2">
                              check_circle
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Popular Localities Section */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#a88a81] block">
                  Popular Food Hubs & Localities
                </span>

                {/* City Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {availableCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => setActiveCityTab(city)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        activeCityTab.toLowerCase() === city.toLowerCase()
                          ? 'bg-[#f36334] text-white shadow-md shadow-[#f36334]/20'
                          : 'bg-[#201e1c] hover:bg-[#282624] text-[#a88a81]'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>

                {/* Localities Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {cityLocalities.map((loc) => {
                    const active = isCurrentlyActive(loc.name, loc.city);
                    return (
                      <button
                        key={loc.id}
                        onClick={() => handleSelectPopularLocality(loc)}
                        className={`flex flex-col items-start p-3 rounded-2xl text-left transition-colors border ${
                          active
                            ? 'bg-[#f36334]/15 border-[#f36334]/50 text-white'
                            : 'bg-[#1c1b1a] hover:bg-[#232120] border-[#292725] text-[#e6e1df]'
                        }`}
                      >
                        <div className="w-full flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-bold text-white truncate">
                            {loc.name}
                          </span>
                          {active && (
                            <span className="material-symbols-outlined text-[#f36334] text-[16px] shrink-0">
                              check_circle
                            </span>
                          )}
                        </div>
                        {loc.landmark && (
                          <span className="text-[10px] text-[#a88a81] truncate mt-0.5">
                            {loc.landmark}
                          </span>
                        )}
                        <span className="text-[10px] text-[#6b625b] mt-1">
                          {loc.city} &bull; {loc.postal_code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Manual Custom Address Toggle */}
              <div className="pt-2 border-t border-[#2a2826]">
                {!showManualForm ? (
                  <button
                    onClick={() => setShowManualForm(true)}
                    className="w-full py-2.5 px-4 rounded-2xl bg-[#201e1c] hover:bg-[#282624] border border-[#2f2d2a] text-xs font-semibold text-[#f36334] flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
                    Enter Complete Address Manually
                  </button>
                ) : (
                  <form onSubmit={handleSaveManualAddress} className="space-y-3 bg-[#161514] p-4 rounded-2xl border border-[#2b2a28]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#f36334] text-[16px]">edit_location</span>
                        Custom Delivery Address
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowManualForm(false)}
                        className="text-[11px] text-[#a88a81] hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Address Line */}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#a88a81] block mb-1">
                        House / Flat / Building / Street *
                      </label>
                      <input
                        type="text"
                        required
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                        placeholder="e.g. Flat 402, Sunshine Heights, 12th Main Road"
                        className="w-full bg-[#1c1b1a] text-white placeholder:text-[#6b625b] px-3 py-2 rounded-xl text-xs border border-[#2e2c2a] focus:outline-none focus:border-[#f36334]"
                      />
                    </div>

                    {/* Locality & City */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#a88a81] block mb-1">
                          Locality / Area
                        </label>
                        <input
                          type="text"
                          value={manualLocality}
                          onChange={(e) => setManualLocality(e.target.value)}
                          placeholder="e.g. Koramangala 4th Block"
                          className="w-full bg-[#1c1b1a] text-white placeholder:text-[#6b625b] px-3 py-2 rounded-xl text-xs border border-[#2e2c2a] focus:outline-none focus:border-[#f36334]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#a88a81] block mb-1">
                          Save As
                        </label>
                        <div className="flex items-center gap-1">
                          {(['Home', 'Work', 'Other'] as const).map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => setManualLabel(tag)}
                              className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                                manualLabel === tag
                                  ? 'bg-[#f36334] text-white border-[#f36334]'
                                  : 'bg-[#201e1c] text-[#a88a81] border-[#2e2c2a]'
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!manualAddress.trim()}
                      className="w-full py-2.5 rounded-xl bg-[#f36334] hover:bg-[#ff7547] disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-[#f36334]/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      Confirm & Deliver to this Address
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#2a2826] bg-[#141312] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#a88a81] truncate">
            <span className="text-[10px] uppercase font-bold text-[#f36334]">Current:</span>
            <span className="text-white truncate font-medium">
              {currentLocation.locality || currentLocation.address}
            </span>
          </div>
          <button
            onClick={closeLocationModal}
            className="px-3 py-1.5 rounded-xl bg-[#232120] hover:bg-[#2e2c2a] text-white text-xs font-semibold shrink-0 ml-2"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
