import React, { useEffect, useRef, useState } from 'react';
import { Button, Text, Stack, Group } from '@mantine/core';
import { IconRefresh, IconMapPin } from '@tabler/icons-react';

const ReliableGoogleMap = ({ bins = [], onBinSelect, userLocation = null, height = '400px' }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userMarker, setUserMarker] = useState(null);
  const [userCircle, setUserCircle] = useState(null);
  const [status, setStatus] = useState('loading'); // loading, loaded, error, fallback
  const [error, setError] = useState('');

  // Get bin coordinates from actual bin data
  const getBinCoordinates = (bin) => {
    // Use actual coordinates if available
    if (bin.latitude && bin.longitude) {
      return { lat: parseFloat(bin.latitude), lng: parseFloat(bin.longitude) };
    }
    // Fallback to Toronto center if no coordinates
    return { lat: 43.6532, lng: -79.3832 };
  };


  // Add user location marker to map
  const addUserLocationMarker = (location) => {
    if (!map || !window.google) return;

    // Remove existing user marker and circle if any
    if (userMarker) {
      userMarker.setMap(null);
    }
    if (userCircle) {
      userCircle.setMap(null);
    }

    // Create new user marker with different style
    const marker = new window.google.maps.Marker({
      position: location,
      map: map,
      title: 'Your Location',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2
      },
      zIndex: 999,
      animation: window.google.maps.Animation.DROP
    });

    // Add pulsing effect circle
    const circle = new window.google.maps.Circle({
      map: map,
      center: location,
      radius: 100,
      fillColor: '#4285F4',
      fillOpacity: 0.15,
      strokeColor: '#4285F4',
      strokeOpacity: 0.3,
      strokeWeight: 1
    });

    // Info window for user location
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 10px;">
          <h4 style="margin: 0 0 5px 0; color: #4285F4;">📍 Your Location</h4>
          <p style="margin: 0; font-size: 12px; color: #666;">You are here</p>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    setUserMarker(marker);
    setUserCircle(circle);
    
    // Center map on user location
    map.setCenter(location);
    map.setZoom(12);
  };

  const initializeMap = () => {
    if (!window.google || !window.google.maps || !mapRef.current) {
      return false;
    }

    try {
      console.log('Initializing Google Maps...');

      const newMap = new window.google.maps.Map(mapRef.current, {
        zoom: 10,
        center: { lat: 43.6532, lng: -79.3832 },
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#458B7A' }]
          }
        ]
      });

      // Add markers - but only if we have bins
      console.log(`Initial bins data:`, bins);
      console.log(`Adding ${bins.length} markers to map...`);
      
      if (!bins || bins.length === 0) {
        console.log('No bins to display on initial map load');
        setMap(newMap);
        setStatus('loaded');
        
        // Expose search function globally even without bins
        window.mapSearchLocation = (address) => {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results[0]) {
              newMap.setCenter(results[0].geometry.location);
              newMap.setZoom(12);
            }
          });
        };
        return true;
      }
      
      const newMarkers = bins.map((bin) => {
        const position = getBinCoordinates(bin);
        console.log(`Adding marker for ${bin.name} at`, position);
        
        const marker = new window.google.maps.Marker({
          position: position,
          map: newMap,
          title: bin.name,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 15px; max-width: 280px;">
              <h3 style="margin: 0 0 10px 0; color: #094C3B; font-size: 16px;">
                ${bin.name} 
                ${bin.bin_number ? `<span style="font-size: 12px; color: #888;">(${bin.bin_number})</span>` : ''}
              </h3>
              <p style="margin: 5px 0; font-size: 14px; color: #666;">
                <strong>📍</strong> ${bin.address}
              </p>
              <p style="margin: 5px 0; font-size: 14px; color: #666;">
                <strong>🕒</strong> ${bin.hours}
              </p>
              <p style="margin: 5px 0; font-size: 14px; color: #666;">
                <strong>📦</strong> ${bin.type}${bin.driveUp ? ' • Drive-up Available' : ''}
              </p>
              ${bin.notes ? `<p style="margin: 5px 0; font-size: 12px; color: #888;">
                <strong>ℹ️</strong> ${bin.notes}
              </p>` : ''}
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(bin.address)}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   style="display: inline-block; padding: 8px 16px; background-color: #4285F4; color: white; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500; text-align: center;">
                  📍 Get Directions
                </a>
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          newMarkers.forEach(m => m.infoWindow && m.infoWindow.close());
          infoWindow.open(newMap, marker);
          if (onBinSelect) onBinSelect(bin);
        });

        marker.infoWindow = infoWindow;
        return marker;
      });

      // Fit bounds to show all markers
      if (newMarkers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
        newMap.fitBounds(bounds);
        
        setTimeout(() => {
          if (newMap.getZoom() > 13) newMap.setZoom(13);
        }, 100);
      }

      setMap(newMap);
      setMarkers(newMarkers);
      setStatus('loaded');

      // Expose search function globally
      window.mapSearchLocation = (address) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            newMap.setCenter(results[0].geometry.location);
            newMap.setZoom(12);
          }
        });
      };

      console.log('Google Maps initialized successfully');
      return true;

    } catch (err) {
      console.error('Error initializing map:', err);
      setError(err.message);
      setStatus('error');
      return false;
    }
  };

  useEffect(() => {
    let timeoutId;
    let checkInterval;

    const loadGoogleMaps = () => {
      // Check if already loaded
      if (window.google && window.google.maps) {
        if (initializeMap()) return;
      }

      // Check if script is loading
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // Wait for existing script to load
        checkInterval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkInterval);
            clearTimeout(timeoutId);
            initializeMap();
          }
        }, 500);
      } else {
        // Load new script
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAOX2t7VI8Y0dQAWvgpHq9dzKjD01ZFK6w&libraries=places';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          clearTimeout(timeoutId);
          initializeMap();
        };
        
        script.onerror = () => {
          clearTimeout(timeoutId);
          setError('Failed to load Google Maps script');
          setStatus('error');
        };
        
        document.head.appendChild(script);
      }

      // Set timeout
      timeoutId = setTimeout(() => {
        clearInterval(checkInterval);
        console.warn('Google Maps loading timeout, switching to fallback');
        setError('Loading timeout - using fallback map');
        setStatus('fallback');
      }, 8000); // Reduced timeout to 8 seconds
    };

    loadGoogleMaps();

    return () => {
      clearTimeout(timeoutId);
      clearInterval(checkInterval);
    };
  }, []);

  // Add user location marker when map is ready and userLocation is provided
  useEffect(() => {
    if (map && userLocation) {
      console.log('Adding user location marker:', userLocation);
      addUserLocationMarker(userLocation);
    }
  }, [map, userLocation]);

  // Re-initialize markers when bins change
  useEffect(() => {
    if (map && bins.length > 0) {
      console.log(`Updating map with ${bins.length} bins`);
      
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      // Add new markers
      const newMarkers = bins.map((bin) => {
        const position = getBinCoordinates(bin);
        console.log(`Adding marker for ${bin.name} at`, position);
        
        const marker = new window.google.maps.Marker({
          position: position,
          map: map,
          title: bin.name,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 15px; max-width: 280px;">
              <h3 style="margin: 0 0 10px 0; color: #094C3B; font-size: 16px;">
                ${bin.name}
                ${bin.bin_number ? `<span style="font-size: 12px; color: #888;">(${bin.bin_number})</span>` : ''}
              </h3>
              <p style="margin: 5px 0; font-size: 14px; color: #666;">
                <strong>📍</strong> ${bin.address}
              </p>
              <p style="margin: 5px 0; font-size: 14px; color: #666;">
                <strong>🕒</strong> ${bin.hours}
              </p>
              <p style="margin: 5px 0; font-size: 14px; color: #666;">
                <strong>📦</strong> ${bin.type}${bin.driveUp ? ' • Drive-up Available' : ''}
              </p>
              ${bin.notes ? `<p style="margin: 5px 0; font-size: 12px; color: #888;">
                <strong>ℹ️</strong> ${bin.notes}
              </p>` : ''}
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(bin.address)}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   style="display: inline-block; padding: 8px 16px; background-color: #4285F4; color: white; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500; text-align: center;">
                  📍 Get Directions
                </a>
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          newMarkers.forEach(m => m.infoWindow && m.infoWindow.close());
          infoWindow.open(map, marker);
          if (onBinSelect) onBinSelect(bin);
        });

        marker.infoWindow = infoWindow;
        return marker;
      });

      // Fit bounds to show all markers
      if (newMarkers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
        map.fitBounds(bounds);
        
        setTimeout(() => {
          if (map.getZoom() > 13) map.setZoom(13);
        }, 100);
      }

      setMarkers(newMarkers);
    }
  }, [map, bins]);

  const retryLoad = () => {
    setStatus('loading');
    setError('');
    
    // Force reload by removing existing script
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Clear window.google
    if (window.google) {
      delete window.google;
    }
    
    // Restart loading
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Fallback iframe map
  const renderFallbackMap = () => (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        📍 Interactive map unavailable - showing Toronto area
      </div>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0, borderRadius: '8px' }}
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d184551.90977312413!2d-79.54286739999999!3d43.6532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb90d7c63ba5%3A0x323555502ab4c477!2sToronto%2C%20ON%2C%20Canada!5e0!3m2!1sen!2sus!4v1641234567890"
        allowFullScreen
        title="Toronto Area Map"
      />
    </div>
  );

  if (status === 'fallback') {
    return (
      <div style={{ height: height, width: '100%', border: '1px solid #ddd', borderRadius: '8px' }}>
        {renderFallbackMap()}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ 
        height: height, 
        width: '100%', 
        backgroundColor: '#fff3cd', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ffeaa7'
      }}>
        <Stack align="center" spacing="md">
          <Text size="lg" color="#856404" weight={600}>Map Loading Issue</Text>
          <Text size="sm" color="#856404" align="center" style={{ maxWidth: 300 }}>
            {error || 'Unable to load interactive map'}
          </Text>
          <Group>
            <Button 
              size="sm" 
              variant="outline" 
              color="orange"
              leftIcon={<IconRefresh size="1rem" />}
              onClick={retryLoad}
            >
              Reload Page
            </Button>
            <Button 
              size="sm" 
              variant="filled"
              style={{ backgroundColor: '#094C3B' }}
              leftIcon={<IconMapPin size="1rem" />}
              onClick={() => setStatus('fallback')}
            >
              Use Basic Map
            </Button>
          </Group>
        </Stack>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {status === 'loading' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          borderRadius: '8px'
        }}>
          <Stack align="center" spacing="sm">
            <Text size="md" color="var(--hh-primary-dark)">Loading interactive map...</Text>
            <Text size="xs" color="dimmed">This may take a few moments</Text>
          </Stack>
        </div>
      )}
      
      <div 
        ref={mapRef}
        style={{ 
          height: height, 
          width: '100%', 
          borderRadius: '8px',
          border: '1px solid #ddd',
          backgroundColor: '#f5f5f5'
        }} 
      />
    </div>
  );
};

export default ReliableGoogleMap;