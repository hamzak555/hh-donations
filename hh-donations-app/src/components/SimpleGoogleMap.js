import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, Stack } from '@mantine/core';

const SimpleGoogleMap = ({ bins, height = '400px' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Google Maps API Key
  const API_KEY = 'AIzaSyAOX2t7VI8Y0dQAWvgpHq9dzKjD01ZFK6w';

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      console.log('Google Maps already loaded');
      initMap();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      console.log('Google Maps script already exists, waiting for load...');
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogle);
          initMap();
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(checkGoogle);
        setError('Timeout waiting for Google Maps to load');
        setLoading(false);
      }, 10000);
      return;
    }

    // Load Google Maps script directly
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google Maps script loaded');
      initMap();
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Maps script');
      setError('Failed to load Google Maps');
      setLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initMap = () => {
    try {
      const mapElement = document.getElementById('google-map');
      if (!mapElement || !window.google) {
        setError('Map element or Google Maps not available');
        setLoading(false);
        return;
      }

      const map = new window.google.maps.Map(mapElement, {
        zoom: 12,
        center: { lat: 43.6532, lng: -79.3832 }, // Toronto
      });

      // Add markers for demo bins
      const demoLocations = [
        { lat: 43.6532, lng: -79.3832, title: 'Downtown Community Center' },
        { lat: 43.6426, lng: -79.4069, title: 'Westside Shopping Plaza' },
        { lat: 43.6629, lng: -79.3957, title: 'Riverside Park Entrance' },
        { lat: 43.7615, lng: -79.4111, title: 'North York Library' }
      ];

      demoLocations.forEach((location, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: location.title,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="padding: 10px;">
                     <h3 style="margin: 0; color: #094C3B;">${location.title}</h3>
                     <p>Click for more details</p>
                   </div>`
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      setLoading(false);
      console.log('Map initialized successfully');
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card shadow="sm" padding="xl" radius="md" style={{ minHeight: height }}>
        <Stack align="center" justify="center" style={{ height: '100%', minHeight: '300px' }}>
          <Text color="red" size="lg" weight={600}>Map Loading Error</Text>
          <Text color="dimmed" align="center">
            Unable to load Google Maps: {error}
          </Text>
          <Text color="dimmed" size="sm" align="center">
            Please check your internet connection and try again.
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <div>
      {loading && (
        <Card shadow="sm" padding="xl" radius="md" style={{ minHeight: height }}>
          <Stack align="center" justify="center" style={{ height: '100%', minHeight: '300px' }}>
            <Text size="lg" weight={600} color="var(--hh-primary-dark)">Loading Map...</Text>
            <Text color="dimmed" align="center">
              Please wait while we load the interactive map.
            </Text>
          </Stack>
        </Card>
      )}
      
      <div 
        id="google-map"
        style={{ 
          height: height, 
          width: '100%', 
          borderRadius: '8px',
          border: '2px solid #f0f0f0',
          display: loading ? 'none' : 'block'
        }} 
      />
    </div>
  );
};

export default SimpleGoogleMap;