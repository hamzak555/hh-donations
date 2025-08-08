import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Paper, Stack, Text, Group, Loader, Alert } from '@mantine/core';
import { IconSearch, IconMapPin, IconAlertCircle } from '@tabler/icons-react';

const SimpleAutocomplete = ({ 
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
  const [error, setError] = useState(null);
  const [internalValue, setInternalValue] = useState(value || '');
  const inputRef = useRef(null);

  // Sync internal value with prop value
  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  // Mock predictions for testing - includes both addresses and landmarks
  const getMockPredictions = (query) => {
    const mockData = [
      // Street addresses
      '22 Bluefin Crescent, Toronto, ON, Canada',
      '123 Main Street, Toronto, ON, Canada',
      '456 King Street West, Toronto, ON, Canada',
      '789 Queen Street East, Toronto, ON, Canada',
      '101 Bay Street, Toronto, ON, Canada',
      '234 Yonge Street, Toronto, ON, Canada',
      '567 Spadina Avenue, Toronto, ON, Canada',
      '890 Bloor Street West, Toronto, ON, Canada',
      '321 College Street, Toronto, ON, Canada',
      '654 Dundas Street West, Toronto, ON, Canada',
      // Landmarks
      'CN Tower, Toronto, ON, Canada',
      'Union Station, Toronto, ON, Canada',
      'Toronto City Hall, Toronto, ON, Canada',
      'Rogers Centre, Toronto, ON, Canada',
      'Casa Loma, Toronto, ON, Canada',
      'Royal Ontario Museum, Toronto, ON, Canada'
    ];

    // Check if query starts with a number
    const isStreetAddress = /^\d/.test(query.trim());
    
    let filteredData = mockData.filter(address => 
      address.toLowerCase().includes(query.toLowerCase())
    );
    
    // Prioritize street addresses if query starts with number
    if (isStreetAddress) {
      filteredData = filteredData.sort((a, b) => {
        const aIsStreet = /^\d/.test(a);
        const bIsStreet = /^\d/.test(b);
        if (aIsStreet && !bIsStreet) return -1;
        if (!aIsStreet && bIsStreet) return 1;
        return 0;
      });
    }

    return filteredData.slice(0, 5);
  };

  // Real Google Places API function
  const getRealPredictions = (query) => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        reject(new Error('Google Places API not loaded'));
        return;
      }

      const service = new window.google.maps.places.AutocompleteService();
      
      // Check if query looks like a street address (starts with number)
      const isStreetAddress = /^\d/.test(query.trim());
      
      // Configure types based on what user is typing
      let types = [];
      if (isStreetAddress) {
        types = ['address']; // Only addresses for numbered entries
      } else {
        types = ['address', 'establishment', 'geocode']; // All types for text
      }
      
      service.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'ca' },
          location: new window.google.maps.LatLng(43.6532, -79.3832), // Toronto center
          radius: 25000, // Reduced to 25km for more relevant results
          types: types,
          // Add session token for better performance
          sessionToken: new window.google.maps.places.AutocompleteSessionToken()
        },
        (predictions, status) => {
          console.log('Google Places response:', status, predictions);
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            // Prioritize addresses over establishments
            const sortedPredictions = predictions.sort((a, b) => {
              const aIsAddress = a.types.includes('street_address') || a.types.includes('premise');
              const bIsAddress = b.types.includes('street_address') || b.types.includes('premise');
              
              if (aIsAddress && !bIsAddress) return -1;
              if (!aIsAddress && bIsAddress) return 1;
              return 0;
            });
            
            resolve(sortedPredictions.map(p => p.description));
          } else {
            reject(new Error(`Places API error: ${status}`));
          }
        }
      );
    });
  };


  // Handle input changes and get predictions
  const handleInputChange = (event) => {
    const inputValue = event.currentTarget.value;
    setInternalValue(inputValue);
    
    // Also update parent
    if (onChange) {
      onChange(event);
    }

    if (inputValue.length < 3) {
      setPredictions([]);
      setShowDropdown(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Try real Google Places API first, fallback to mock data
    getRealPredictions(inputValue)
      .then(realPredictions => {
        console.log('✅ Real predictions received:', realPredictions);
        setPredictions(realPredictions);
        setShowDropdown(true);
        setIsLoading(false);
      })
      .catch(error => {
        console.warn('⚠️ Google Places API failed, using mock data:', error.message);
        
        // Fallback to mock predictions
        const mockPredictions = getMockPredictions(inputValue);
        setPredictions(mockPredictions);
        setShowDropdown(mockPredictions.length > 0);
        setError('Using sample data - Google Places API unavailable');
        setIsLoading(false);
      });
  };

  // Handle prediction selection
  const handlePredictionClick = (prediction) => {
    console.log('🔄 Prediction clicked:', prediction);
    
    // Close dropdown first
    setPredictions([]);
    setShowDropdown(false);

    // Update internal value 
    setInternalValue(prediction);
    console.log('🔄 Updated internalValue to:', prediction);

    // Force update the input element directly
    if (inputRef.current && inputRef.current.inputElement) {
      inputRef.current.inputElement.value = prediction;
      console.log('🔄 Directly set input element value to:', prediction);
    }

    // Update parent state
    if (onChange) {
      const mockEvent = { currentTarget: { value: prediction } };
      console.log('🔄 Calling parent onChange with:', prediction);
      onChange(mockEvent);
    }

    // Trigger search
    if (onAddressSelect) {
      console.log('🔄 Calling onAddressSelect with:', prediction);
      onAddressSelect(prediction);
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
    <div style={{ 
      position: 'relative', 
      width: '100%',
      zIndex: 1 // Ensure parent has stacking context
    }} ref={inputRef}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
          <IconSearch size="1rem" color="#666" />
        </div>
        <input
          ref={(el) => { 
            if (el && inputRef.current) {
              inputRef.current.inputElement = el;
            }
          }}
          type="text"
          placeholder={placeholder}
          value={internalValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            height: '42px',
            paddingLeft: '40px',
            paddingRight: isLoading ? '40px' : '16px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#339af0';
            e.target.style.boxShadow = '0 0 0 1px #339af0';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#ced4da';
            e.target.style.boxShadow = 'none';
          }}
        />
        {isLoading && (
          <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            <Loader size="sm" />
          </div>
        )}
      </div>

      {error && (
        <Alert 
          icon={<IconAlertCircle size="1rem" />}
          color="orange"
          size="xs" 
          style={{ marginTop: '4px', fontSize: '11px' }}
        >
          {error}
        </Alert>
      )}
      

      {/* Portal-based dropdown that renders at document root */}
      {showDropdown && predictions.length > 0 && createPortal(
        <Paper
          shadow="xl"
          style={{
            position: 'absolute',
            top: inputRef.current ? inputRef.current.getBoundingClientRect().bottom + window.scrollY + 4 : 0,
            left: inputRef.current ? inputRef.current.getBoundingClientRect().left + window.scrollX : 0,
            width: inputRef.current ? inputRef.current.getBoundingClientRect().width : 300,
            zIndex: 999999, // Very high z-index
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #e0e0e0',
            backgroundColor: 'white',
            borderRadius: '8px'
          }}
        >
          <Stack spacing={0}>
            {predictions.map((prediction, index) => (
              <div
                key={index}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: index < predictions.length - 1 ? '1px solid #f0f0f0' : 'none',
                  transition: 'background-color 0.15s ease',
                  backgroundColor: 'white',
                  borderRadius: index === 0 ? '8px 8px 0 0' : (index === predictions.length - 1 ? '0 0 8px 8px' : '0')
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                }}
                onClick={() => handlePredictionClick(prediction)}
              >
                <Group spacing="sm" style={{ flexWrap: 'nowrap' }}>
                  <IconMapPin 
                    size="1rem" 
                    color="var(--hh-primary)" 
                    style={{ flexShrink: 0, marginTop: '1px' }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text 
                      size="sm" 
                      weight={500} 
                      style={{ 
                        color: 'var(--hh-primary-dark)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {prediction.split(',')[0]}
                    </Text>
                    <Text 
                      size="xs" 
                      color="dimmed" 
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {prediction.split(',').slice(1).join(',').trim()}
                    </Text>
                  </div>
                </Group>
              </div>
            ))}
            
            <div style={{
              padding: '6px 16px',
              borderTop: '1px solid #f0f0f0',
              backgroundColor: '#f8f9fa',
              fontSize: '10px',
              color: '#666',
              borderRadius: '0 0 8px 8px'
            }}>
              {error ? '⚠️ Sample suggestions' : '🌐 Powered by Google Places'}
            </div>
          </Stack>
        </Paper>,
        document.body
      )}
    </div>
  );
};

export default SimpleAutocomplete;