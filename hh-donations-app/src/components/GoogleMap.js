import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, Text, Stack, Group, Button, Badge } from '@mantine/core';
import { IconMapPin, IconClock, IconCar } from '@tabler/icons-react';

const GoogleMap = ({ bins, onBinSelect, height = '400px' }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Google Maps API Key from environment variables
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyAOX2t7VI8Y0dQAWvgpHq9dzKjD01ZFK6w';

  // Default center (Toronto, ON)
  const defaultCenter = { lat: 43.6532, lng: -79.3832 };

  console.log('GoogleMap component loaded with API key:', API_KEY ? 'Present' : 'Missing');

  useEffect(() => {
    console.log('Loading Google Maps API...');
    const loader = new Loader({
      apiKey: API_KEY,
      version: 'weekly',
      libraries: ['maps'],
    });

    loader.load()
      .then(() => {
        console.log('Google Maps API loaded successfully');
        if (mapRef.current && !map) {
          console.log('Creating map instance...');
          const newMap = new window.google.maps.Map(mapRef.current, {
            zoom: 12,
            center: defaultCenter,
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }],
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#458B7A' }],
              },
            ],
          });
          setMap(newMap);
          setLoading(false);
          console.log('Map created successfully');
        }
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [map, API_KEY]);

  useEffect(() => {
    if (map && bins && bins.length > 0) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      const newMarkers = bins.map((bin, index) => {
        // Convert address to coordinates (in real app, you'd geocode or have lat/lng in data)
        // For demo, using approximate Toronto coordinates with offsets
        const coordinates = getCoordinatesForBin(index);
        
        const marker = new window.google.maps.Marker({
          position: coordinates,
          map: map,
          title: bin.name,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new window.google.maps.Size(40, 40),
          },
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: createInfoWindowContent(bin),
        });

        marker.addListener('click', () => {
          // Close other info windows
          markers.forEach(m => {
            if (m.infoWindow) {
              m.infoWindow.close();
            }
          });
          
          infoWindow.open(map, marker);
          setSelectedBin(bin);
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
        
        // Ensure minimum zoom level
        const listener = window.google.maps.event.addListener(map, 'idle', () => {
          if (map.getZoom() > 15) map.setZoom(15);
          window.google.maps.event.removeListener(listener);
        });
      }
    }
  }, [map, bins]);

  // Helper function to get demo coordinates
  const getCoordinatesForBin = (index) => {
    const baseCoordinates = [
      { lat: 43.6532, lng: -79.3832 }, // Downtown Toronto
      { lat: 43.6426, lng: -79.4069 }, // West Toronto
      { lat: 43.6629, lng: -79.3957 }, // Midtown
      { lat: 43.7615, lng: -79.4111 }, // North York
    ];
    return baseCoordinates[index] || defaultCenter;
  };

  const createInfoWindowContent = (bin) => {
    return `
      <div style="padding: 10px; min-width: 200px;">
        <h3 style="margin: 0 0 10px 0; color: #094C3B;">${bin.name}</h3>
        <p style="margin: 5px 0; font-size: 14px;">${bin.address}</p>
        <p style="margin: 5px 0; font-size: 14px; color: #666;">
          <strong>Hours:</strong> ${bin.hours}
        </p>
        <p style="margin: 5px 0; font-size: 14px; color: #666;">
          <strong>Type:</strong> ${bin.type}
          ${bin.driveUp ? ' • Drive-up Available' : ''}
        </p>
        ${bin.notes ? `<p style="margin: 5px 0; font-size: 12px; color: #888;">${bin.notes}</p>` : ''}
      </div>
    `;
  };

  if (error) {
    return (
      <Card shadow="sm" padding="xl" radius="md" style={{ minHeight: height }}>
        <Stack align="center" justify="center" style={{ height: '100%', minHeight: '300px' }}>
          <Text color="red" size="lg" weight={600}>Map Loading Error</Text>
          <Text color="dimmed" align="center">
            Unable to load Google Maps. Please check your internet connection.
          </Text>
          <Text color="dimmed" size="sm" align="center">
            Error: {error}
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
        ref={mapRef} 
        style={{ 
          height: height, 
          width: '100%', 
          borderRadius: '8px',
          border: '2px solid #f0f0f0',
          display: loading ? 'none' : 'block'
        }} 
      />
      
      {selectedBin && (
        <Card shadow="sm" padding="md" radius="md" style={{ marginTop: '1rem' }}>
          <Stack spacing="xs">
            <Group position="apart">
              <Text weight={600} style={{ color: 'var(--hh-primary-dark)' }}>
                Selected: {selectedBin.name}
              </Text>
              <Badge color={selectedBin.type === 'Indoor' ? 'blue' : 'green'}>
                {selectedBin.type}
              </Badge>
            </Group>
            <Group spacing="sm">
              <IconMapPin size="1rem" color="var(--hh-primary)" />
              <Text size="sm" color="dimmed">{selectedBin.address}</Text>
            </Group>
            <Group spacing="sm">
              <IconClock size="1rem" color="var(--hh-primary)" />
              <Text size="sm" color="dimmed">{selectedBin.hours}</Text>
            </Group>
            <Button 
              size="sm" 
              style={{ backgroundColor: 'var(--hh-primary-dark)', alignSelf: 'flex-start' }}
              leftIcon={<IconMapPin size="1rem" />}
            >
              Get Directions
            </Button>
          </Stack>
        </Card>
      )}
    </div>
  );
};

export default GoogleMap;