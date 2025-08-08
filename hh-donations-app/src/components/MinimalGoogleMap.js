import React, { useEffect, useRef, useState } from 'react';

const MinimalGoogleMap = ({ height = '400px' }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadMap = () => {
      if (!mounted || !mapRef.current) return;

      try {
        if (window.google && window.google.maps) {
          console.log('Google Maps available, creating map...');
          
          const map = new window.google.maps.Map(mapRef.current, {
            zoom: 12,
            center: { lat: 43.6532, lng: -79.3832 }
          });

          new window.google.maps.Marker({
            position: { lat: 43.6532, lng: -79.3832 },
            map: map,
            title: 'HH Donations Location'
          });

          setMapLoaded(true);
          console.log('Map loaded successfully');
        }
      } catch (error) {
        console.error('Error creating map:', error);
      }
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      loadMap();
    } else {
      // Create script element only if it doesn't exist
      let script = document.querySelector('script[src*="maps.googleapis.com"]');
      
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAOX2t7VI8Y0dQAWvgpHq9dzKjD01ZFK6w';
        script.async = true;
        
        script.onload = () => {
          if (mounted) {
            console.log('Google Maps script loaded');
            loadMap();
          }
        };
        
        script.onerror = () => {
          console.error('Failed to load Google Maps script');
        };
        
        document.head.appendChild(script);
      } else {
        // Script exists, wait for Google to be available
        const checkGoogle = setInterval(() => {
          if (!mounted) {
            clearInterval(checkGoogle);
            return;
          }
          
          if (window.google && window.google.maps) {
            clearInterval(checkGoogle);
            loadMap();
          }
        }, 500);
        
        // Cleanup after 10 seconds
        setTimeout(() => {
          clearInterval(checkGoogle);
        }, 10000);
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div 
      ref={mapRef}
      style={{ 
        height: height, 
        width: '100%', 
        backgroundColor: mapLoaded ? 'transparent' : '#f5f5f5',
        borderRadius: '8px',
        border: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#888',
        fontSize: '14px'
      }}
    >
      {!mapLoaded && 'Loading map...'}
    </div>
  );
};

export default MinimalGoogleMap;