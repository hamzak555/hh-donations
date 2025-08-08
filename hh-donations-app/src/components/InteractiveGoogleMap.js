import React, { useEffect, useRef, useState } from 'react';
import { Text } from '@mantine/core';

const InteractiveGoogleMap = ({ bins = [], onBinSelect, height = '400px' }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Convert bin data to coordinates (in a real app, this would come from your backend)
  const getBinCoordinates = (binIndex) => {
    const coords = [
      { lat: 43.6532, lng: -79.3832 }, // Downtown Toronto
      { lat: 43.6426, lng: -79.4069 }, // West Toronto  
      { lat: 43.6629, lng: -79.3957 }, // Midtown
      { lat: 43.7615, lng: -79.4111 }, // North York
    ];
    return coords[binIndex] || coords[0];
  };

  useEffect(() => {
    const initMap = () => {
      if (!window.google || !window.google.maps || !mapRef.current) {
        return;
      }

      try {
        console.log('Creating interactive Google Map...');

        // Create map
        const newMap = new window.google.maps.Map(mapRef.current, {
          zoom: 11,
          center: { lat: 43.6532, lng: -79.3832 }, // Toronto center
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#458B7A' }] // HH brand color for water
            }
          ]
        });

        setMap(newMap);
        setIsLoaded(true);
        console.log('Interactive map created successfully');

      } catch (err) {
        console.error('Error creating map:', err);
        setError('Failed to create map');
      }
    };

    // Load Google Maps if not already loaded
    if (!window.google || !window.google.maps) {
      // Check if script already exists
      if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAOX2t7VI8Y0dQAWvgpHq9dzKjD01ZFK6w&libraries=places';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log('Google Maps JS API loaded');
          initMap();
        };
        
        script.onerror = () => {
          console.error('Failed to load Google Maps');
          setError('Failed to load Google Maps');
        };
        
        document.head.appendChild(script);
      } else {
        // Script exists, wait for Google to be available
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkInterval);
            initMap();
          }
        }, 500);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!isLoaded) {
            setError('Timeout loading Google Maps');
          }
        }, 10000);
      }
    } else {
      initMap();
    }
  }, []);

  // Add markers when map is ready and bins data changes
  useEffect(() => {
    if (!map || !bins || bins.length === 0) return;

    console.log('Adding markers for', bins.length, 'bins');

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers = bins.map((bin, index) => {
      const position = getBinCoordinates(index);
      
      const marker = new window.google.maps.Marker({
        position: position,
        map: map,
        title: bin.name,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 15px; max-width: 250px;">
            <h3 style="margin: 0 0 10px 0; color: #094C3B; font-size: 16px;">${bin.name}</h3>
            <p style="margin: 5px 0; font-size: 14px; color: #666;">
              <strong>📍</strong> ${bin.address}
            </p>
            <p style="margin: 5px 0; font-size: 14px; color: #666;">
              <strong>🕒</strong> ${bin.hours}
            </p>
            <p style="margin: 5px 0; font-size: 14px; color: #666;">
              <strong>📦</strong> ${bin.type}${bin.driveUp ? ' • Drive-up Available' : ''}
            </p>
            ${bin.notes ? `<p style="margin: 10px 0 0 0; font-size: 12px; color: #888; font-style: italic;">${bin.notes}</p>` : ''}
          </div>
        `
      });

      // Add click listener
      marker.addListener('click', () => {
        // Close other info windows
        markers.forEach(m => {
          if (m.infoWindow) {
            m.infoWindow.close();
          }
        });

        infoWindow.open(map, marker);
        
        // Notify parent component
        if (onBinSelect) {
          onBinSelect(bin);
        }
      });

      marker.infoWindow = infoWindow;
      return marker;
    });

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);

      // Set minimum zoom
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 13) map.setZoom(13);
        window.google.maps.event.removeListener(listener);
      });
    }

  }, [map, bins]);

  // Method to search and center map on location
  const searchLocation = (address) => {
    if (!map || !window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(12);
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  };

  // Expose search method to parent component
  useEffect(() => {
    if (map && onBinSelect) {
      // Store search method on window for parent to access
      window.mapSearchLocation = searchLocation;
    }
  }, [map]);

  if (error) {
    return (
      <div style={{ 
        height: height, 
        width: '100%', 
        backgroundColor: '#ffebee', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#d32f2f',
        fontSize: '14px',
        border: '1px solid #ffcdd2'
      }}>
        ❌ {error}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          borderRadius: '8px'
        }}>
          <Text size="md" color="var(--hh-primary-dark)">Loading interactive map...</Text>
        </div>
      )}
      
      <div 
        ref={mapRef}
        style={{ 
          height: height, 
          width: '100%', 
          borderRadius: '8px',
          border: '1px solid #ddd'
        }} 
      />
    </div>
  );
};

export default InteractiveGoogleMap;