import React, { useState, useRef, useEffect } from 'react';
import { TextInput, Paper, Stack, Text, Group, Loader } from '@mantine/core';
import { IconSearch, IconMapPin, IconCurrentLocation } from '@tabler/icons-react';

const AddressAutocomplete = ({ 
  placeholder = "Enter your address, postal code, or city",
  onAddressSelect,
  onSearch,
  value,
  onChange,
  onKeyPress
}) => {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [service, setService] = useState(null);
  const inputRef = useRef(null);

  // Initialize Google Places Autocomplete Service
  useEffect(() => {
    console.log('Initializing Places service...');
    const initPlacesService = () => {
      console.log('Google status:', {
        google: !!window.google,
        maps: !!(window.google && window.google.maps),
        places: !!(window.google && window.google.maps && window.google.maps.places)
      });
      
      if (window.google && window.google.maps && window.google.maps.places) {
        console.log('Creating AutocompleteService...');
        const autocompleteService = new window.google.maps.places.AutocompleteService();
        setService(autocompleteService);
        console.log('Google Places Autocomplete service initialized successfully');
      } else {
        console.log('Google Places not ready yet');
      }
    };

    if (window.google && window.google.maps && window.google.maps.places) {
      initPlacesService();
    } else {
      console.log('Waiting for Google Maps to load...');
      // Wait for Google Maps to load
      const checkGoogle = setInterval(() => {
        console.log('Checking Google Maps availability...');
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(checkGoogle);
          initPlacesService();
        }
      }, 500);

      // Cleanup after 10 seconds
      setTimeout(() => {
        clearInterval(checkGoogle);
        console.log('Timeout waiting for Google Places API');
      }, 10000);

      return () => clearInterval(checkGoogle);
    }
  }, []);

  // Handle input changes and get predictions
  const handleInputChange = (event) => {
    const inputValue = event.currentTarget.value;
    onChange(event);

    console.log('Input changed:', inputValue, 'Service available:', !!service);

    if (!service || inputValue.length < 3) {
      console.log('No service or input too short');
      setPredictions([]);
      setShowDropdown(false);
      return;
    }

    console.log('Fetching predictions for:', inputValue);
    setIsLoading(true);

    // Get predictions from Google Places
    service.getPlacePredictions(
      {
        input: inputValue,
        componentRestrictions: { country: 'ca' }, // Restrict to Canada
        location: new window.google.maps.LatLng(43.6532, -79.3832), // Toronto center
        radius: 100000, // 100km radius around Toronto
        types: ['address', 'establishment', 'geocode'] // Include addresses and places
      },
      (predictions, status) => {
        setIsLoading(false);
        console.log('Predictions response:', status, predictions);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          console.log('Setting predictions:', predictions.length);
          setPredictions(predictions.slice(0, 5)); // Show max 5 suggestions
          setShowDropdown(true);
        } else {
          console.log('No predictions or error:', status);
          setPredictions([]);
          setShowDropdown(false);
        }
      }
    );
  };

  // Handle prediction selection
  const handlePredictionClick = (prediction) => {
    if (onChange) {
      const mockEvent = { currentTarget: { value: prediction.description } };
      onChange(mockEvent);
    }
    
    setPredictions([]);
    setShowDropdown(false);

    // Notify parent components
    if (onAddressSelect) {
      onAddressSelect(prediction.description, prediction);
    }
    
    // Trigger search automatically
    if (onSearch) {
      onSearch(prediction.description);
    }
  };

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setShowDropdown(false);
    }
    
    if (onKeyPress) {
      onKeyPress(event);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={inputRef}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        icon={<IconSearch size="1rem" />}
        size="md"
        rightSection={isLoading ? <Loader size="sm" /> : null}
      />
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
          Service: {service ? '✅' : '❌'} | Dropdown: {showDropdown ? '✅' : '❌'} | Predictions: {predictions.length}
        </div>
      )}

      {showDropdown && predictions.length > 0 && (
        <Paper
          shadow="lg"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: '300px',
            overflowY: 'auto',
            marginTop: '4px'
          }}
        >
          <Stack spacing={0}>
            {predictions.map((prediction, index) => (
              <div
                key={prediction.place_id || index}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: index < predictions.length - 1 ? '1px solid #f0f0f0' : 'none',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
                onClick={() => handlePredictionClick(prediction)}
              >
                <Group spacing="sm" noWrap>
                  <IconMapPin 
                    size="1rem" 
                    color="var(--hh-primary)" 
                    style={{ flexShrink: 0, marginTop: '2px' }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text size="sm" weight={500} style={{ 
                      color: 'var(--hh-primary-dark)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {prediction.structured_formatting?.main_text || prediction.description.split(',')[0]}
                    </Text>
                    <Text size="xs" color="dimmed" style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {prediction.structured_formatting?.secondary_text || 
                       prediction.description.split(',').slice(1).join(',').trim()}
                    </Text>
                  </div>
                </Group>
              </div>
            ))}
            
            <div style={{
              padding: '8px 16px',
              borderTop: '1px solid #f0f0f0',
              backgroundColor: '#f8f9fa'
            }}>
              <Group spacing="xs">
                <IconCurrentLocation size="0.8rem" color="#666" />
                <Text size="xs" color="dimmed">
                  Powered by Google Places
                </Text>
              </Group>
            </div>
          </Stack>
        </Paper>
      )}
    </div>
  );
};

export default AddressAutocomplete;