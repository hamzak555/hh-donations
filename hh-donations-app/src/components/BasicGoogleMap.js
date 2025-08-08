import React, { useEffect, useRef } from 'react';
import { Card, Text, Stack } from '@mantine/core';

const BasicGoogleMap = ({ height = '400px' }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Simple function to initialize the map
    const initMap = () => {
      if (!window.google || !window.google.maps) {
        console.log('Google Maps not loaded yet');
        return;
      }

      console.log('Creating basic map...');
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: { lat: 43.6532, lng: -79.3832 }, // Toronto
      });

      // Add a simple marker
      const marker = new window.google.maps.Marker({
        position: { lat: 43.6532, lng: -79.3832 },
        map: map,
        title: 'Downtown Community Center'
      });

      console.log('Basic map created successfully');
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Load Google Maps if not already loaded
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAOX2t7VI8Y0dQAWvgpHq9dzKjD01ZFK6w';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps loaded, initializing...');
        initMap();
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Google Maps:', error);
      };

      // Only add script if it doesn't already exist
      if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
        document.head.appendChild(script);
      }
    }
  }, []);

  return (
    <div>
      <div 
        ref={mapRef}
        style={{ 
          height: height, 
          width: '100%', 
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }} 
      />
    </div>
  );
};

export default BasicGoogleMap;