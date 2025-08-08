import React, { useEffect } from 'react';

const DirectGoogleMap = ({ height = '400px' }) => {
  useEffect(() => {
    // Set up global callback function
    window.initDirectMap = function() {
      console.log('Direct map callback triggered');
      const map = new window.google.maps.Map(document.getElementById('direct-map'), {
        zoom: 12,
        center: { lat: 43.6532, lng: -79.3832 }
      });

      const marker = new window.google.maps.Marker({
        position: { lat: 43.6532, lng: -79.3832 },
        map: map,
        title: 'Direct Map Test'
      });

      console.log('Direct map initialized successfully');
    };

    // Load script if not already present
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAOX2t7VI8Y0dQAWvgpHq9dzKjD01ZFK6w&callback=initDirectMap';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.google && window.google.maps) {
      // If already loaded, initialize directly
      window.initDirectMap();
    }

    // Cleanup
    return () => {
      if (window.initDirectMap) {
        delete window.initDirectMap;
      }
    };
  }, []);

  return (
    <div 
      id="direct-map"
      style={{ 
        height: height, 
        width: '100%', 
        backgroundColor: '#e8e8e8',
        borderRadius: '8px',
        border: '2px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontSize: '14px'
      }}
    >
      Loading Google Maps...
    </div>
  );
};

export default DirectGoogleMap;