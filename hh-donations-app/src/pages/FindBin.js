import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Card, 
  Stack, 
  Group, 
  Select,
  Box,
  Badge,
  Checkbox,
  SimpleGrid,
  Alert,
  Loader,
  Pagination,
  Center
} from '@mantine/core';
import { 
  IconMapPin, 
  IconCar,
  IconHome,
  IconClock,
  IconInfoCircle,
  IconMap,
  IconCurrentLocation
} from '@tabler/icons-react';
import ReliableGoogleMap from '../components/ReliableGoogleMap';
import SimpleAutocomplete from '../components/SimpleAutocomplete';
import { API_BASE } from '../utils/apiConfig';

const FindBin = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({
    openNow: false,
    indoor: false,
    outdoor: false,
    driveUp: false
  });
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // API endpoint is imported from apiConfig
  const [allBins, setAllBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch bins from backend
  useEffect(() => {
    const fetchBins = async () => {
      try {
        console.log('Fetching bins from:', `${API_BASE}/bins`);
        const response = await fetch(`${API_BASE}/bins`);
        if (response.ok) {
          const data = await response.json();
          console.log(`Fetched ${data.length} bins:`, data);
          // Sort bins by default distance on initial load
          data.sort((a, b) => {
            const distA = parseFloat(a.distance) || 999;
            const distB = parseFloat(b.distance) || 999;
            return distA - distB;
          });
          setAllBins(data);
        } else {
          setError('Failed to load donation bins');
        }
      } catch (err) {
        console.error('Error fetching bins:', err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchBins();
  }, []);

  const [filteredBins, setFilteredBins] = useState([]);

  useEffect(() => {
    // Filter bins based on search and filters
    let filtered = allBins;

    if (searchValue) {
      filtered = filtered.filter(bin => 
        bin.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        bin.address.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (filters.indoor) {
      filtered = filtered.filter(bin => bin.type === 'Indoor');
    }
    
    if (filters.outdoor) {
      filtered = filtered.filter(bin => bin.type === 'Outdoor');
    }

    if (filters.driveUp) {
      filtered = filtered.filter(bin => bin.driveUp);
    }

    // Always sort by distance (closest first)
    filtered.sort((a, b) => {
      // If we have calculated distances from user location, use those
      if (a.calculatedDistance && b.calculatedDistance) {
        return parseFloat(a.calculatedDistance) - parseFloat(b.calculatedDistance);
      }
      // If only one has calculated distance, prioritize it
      if (a.calculatedDistance && !b.calculatedDistance) return -1;
      if (!a.calculatedDistance && b.calculatedDistance) return 1;
      // Otherwise use the default distance values
      const distA = parseFloat(a.distance) || 999;
      const distB = parseFloat(b.distance) || 999;
      return distA - distB;
    });

    setFilteredBins(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchValue, filters, allBins]);

  const handleFilterChange = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const handleSearch = (address = searchValue) => {
    if (address && window.mapSearchLocation) {
      // If address doesn't contain province/country, add Toronto context
      const fullAddress = address.toLowerCase().includes('toronto') || 
                          address.toLowerCase().includes('ontario') ||
                          address.toLowerCase().includes('on') || 
                          address.toLowerCase().includes('canada')
        ? address
        : `${address}, Toronto, ON`;
      
      window.mapSearchLocation(fullAddress);
    }
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddressSelect = (address) => {
    console.log('🎯 Address selected in parent:', address);
    console.log('🎯 Current searchValue before update:', searchValue);
    // Trigger search with the selected address
    console.log('🎯 Triggering search for:', address);
    handleSearch(address);
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  // Find user's location
  const findUserLocation = () => {
    setLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('User location found:', location);
          setUserLocation(location);
          setLoadingLocation(false);
          
          // Center map on user location
          if (window.mapSearchLocation) {
            window.mapSearchLocation(`${location.lat}, ${location.lng}`);
          }
          
          // Update bins with calculated distances
          const binsWithDistance = allBins.map(bin => ({
            ...bin,
            calculatedDistance: bin.latitude && bin.longitude 
              ? calculateDistance(location.lat, location.lng, bin.latitude, bin.longitude)
              : null
          }));
          
          // Sort by distance
          binsWithDistance.sort((a, b) => {
            if (!a.calculatedDistance) return 1;
            if (!b.calculatedDistance) return -1;
            return parseFloat(a.calculatedDistance) - parseFloat(b.calculatedDistance);
          });
          
          setAllBins(binsWithDistance);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoadingLocation(false);
          alert('Unable to get your location. Please ensure location services are enabled.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLoadingLocation(false);
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredBins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBins = filteredBins.slice(startIndex, endIndex);

  return (
    <Box style={{ backgroundColor: '#fafafa', minHeight: '100vh', fontFamily: '"Cal Sans", -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <Container size="xl" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* Error Alert */}
        {error && (
          <Alert 
            icon={<IconInfoCircle size="1rem" />} 
            title="Connection Error" 
            style={{ 
              backgroundColor: '#fef2f2', 
              borderColor: '#fecaca', 
              color: '#991b1b',
              marginBottom: '2rem',
              borderRadius: '8px'
            }}
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Loader size="lg" color="#1c1c1c" />
            <Text style={{ marginTop: '1rem', color: '#666' }}>Loading donation bins...</Text>
          </div>
        )}

        {/* Interactive Google Map */}
        <Card 
          padding="2rem" 
          radius="12px"
          style={{ 
            backgroundColor: 'white',
            border: '1px solid #e1e2e3',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            marginBottom: '3rem'
          }}
        >
          <Stack spacing="1.5rem">
            <Group position="apart" align="center">
              <Group spacing="0.75rem">
                <IconMap size="24px" color="#666" />
                <Title 
                  order={3} 
                  style={{ 
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#1c1c1c'
                  }}
                >
                  Donation Bin Locations
                </Title>
              </Group>
              {userLocation && (
                <Badge 
                  style={{ 
                    backgroundColor: '#f4f4f4', 
                    color: '#666',
                    border: '1px solid #e1e2e3',
                    fontWeight: 500
                  }} 
                  leftIcon={<IconCurrentLocation size="0.8rem" />}
                >
                  Your location shown
                </Badge>
              )}
            </Group>
            
            <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
              {console.log(`Passing ${filteredBins.length} bins to map component`)}
              <ReliableGoogleMap 
                bins={filteredBins}
                userLocation={userLocation}
                height="400px"
                onBinSelect={(bin) => {
                  console.log('Bin selected:', bin.name);
                }}
              />
            </div>
          </Stack>
        </Card>

        {/* Search and Filters */}
        <Card 
          padding="2rem" 
          radius="12px"
          style={{ 
            backgroundColor: 'white',
            border: '1px solid #e1e2e3',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            marginBottom: '3rem'
          }}
        >
          <Stack spacing="1.5rem">
            <Group spacing="0.75rem">
              <SimpleAutocomplete
                placeholder="Enter your address, postal code, or city"
                value={searchValue}
                onChange={(event) => setSearchValue(event.currentTarget.value)}
                onKeyPress={handleSearchKeyPress}
                onAddressSelect={handleAddressSelect}
                onSearch={handleSearch}
                style={{ 
                  flex: 1,
                  '--input-radius': '8px',
                  '--input-border-color': '#e1e2e3'
                }}
              />
              <Button
                leftIcon={<IconCurrentLocation size="1rem" />}
                onClick={findUserLocation}
                loading={loadingLocation}
                style={{
                  backgroundColor: '#1c1c1c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 500,
                  padding: '10px 16px'
                }}
              >
                Use My Location
              </Button>
            </Group>
            
            <Group spacing="1.5rem" align="center">
              <Text style={{ fontWeight: 500, color: '#666', fontSize: '0.9375rem' }}>
                Filters:
              </Text>
              <Checkbox
                label="Open Now"
                checked={filters.openNow}
                onChange={() => handleFilterChange('openNow')}
                styles={{
                  label: { fontSize: '0.9375rem', color: '#666' }
                }}
              />
              <Checkbox
                label="Drive-up Access"
                checked={filters.driveUp}
                onChange={() => handleFilterChange('driveUp')}
                styles={{
                  label: { fontSize: '0.9375rem', color: '#666' }
                }}
              />
            </Group>
          </Stack>
        </Card>

        {/* Results */}
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <Title 
                  order={2} 
                  style={{ 
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#1c1c1c',
                    marginBottom: '0.5rem'
                  }}
                >
                  Nearby Donation Bins ({filteredBins.length})
                </Title>
                <Text style={{ fontSize: '0.9375rem', color: '#666' }}>
                  Sorted by distance • Closest first
                </Text>
              </div>
              
              <Group spacing="0.5rem">
                <Badge 
                  size="sm"
                  style={{ 
                    backgroundColor: filters.indoor === false && filters.outdoor === false ? '#1c1c1c' : '#f4f4f4', 
                    color: filters.indoor === false && filters.outdoor === false ? 'white' : '#666',
                    cursor: 'pointer',
                    border: '1px solid #e1e2e3',
                    fontWeight: 500
                  }}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, indoor: false, outdoor: false }));
                  }}
                >
                  All Types
                </Badge>
                <Badge 
                  size="sm"
                  style={{ 
                    backgroundColor: filters.indoor ? '#1c1c1c' : '#f4f4f4', 
                    color: filters.indoor ? 'white' : '#666',
                    cursor: 'pointer',
                    border: '1px solid #e1e2e3',
                    fontWeight: 500
                  }}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, indoor: !prev.indoor, outdoor: false }));
                  }}
                >
                  Indoor Only
                </Badge>
                <Badge 
                  size="sm"
                  style={{ 
                    backgroundColor: filters.outdoor ? '#1c1c1c' : '#f4f4f4', 
                    color: filters.outdoor ? 'white' : '#666',
                    cursor: 'pointer',
                    border: '1px solid #e1e2e3',
                    fontWeight: 500
                  }}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, outdoor: !prev.outdoor, indoor: false }));
                  }}
                >
                  Outdoor Only
                </Badge>
              </Group>
            </div>
          </div>

          <Stack spacing="1rem">
            {currentBins.map((bin) => (
              <Card 
                key={bin.id} 
                id={`bin-${bin.id}`} 
                padding="1.5rem" 
                radius="12px"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e1e2e3',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <Group spacing="0.75rem" style={{ marginBottom: '0.5rem' }}>
                        <Title 
                          order={4} 
                          style={{ 
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: '#1c1c1c'
                          }}
                        >
                          {bin.name}
                        </Title>
                        <Badge 
                          size="sm"
                          style={{
                            backgroundColor: bin.type === 'Indoor' ? '#dbeafe' : '#dcfce7',
                            color: bin.type === 'Indoor' ? '#1e40af' : '#166534',
                            fontWeight: 500
                          }}
                        >
                          {bin.type}
                        </Badge>
                        {bin.driveUp && (
                          <Badge 
                            size="sm"
                            style={{
                              backgroundColor: '#e0f2fe',
                              color: '#0369a1',
                              fontWeight: 500
                            }}
                          >
                            <Group spacing="0">
                              <IconCar size="12px" style={{ marginRight: '2px' }} />
                              Drive-up
                            </Group>
                          </Badge>
                        )}
                      </Group>
                    </div>
                    
                    <Stack spacing="0.5rem">
                      <Group spacing="0.5rem">
                        <IconMapPin size="16px" color="#666" />
                        <Text style={{ fontSize: '0.9375rem', color: '#666' }}>{bin.address}</Text>
                      </Group>
                      
                      <Group spacing="0.5rem">
                        <IconClock size="16px" color="#666" />
                        <Text style={{ fontSize: '0.9375rem', color: '#666' }}>{bin.hours}</Text>
                      </Group>
                      
                      {bin.notes && (
                        <Group spacing="0.5rem" align="flex-start">
                          <IconInfoCircle size="16px" color="#666" style={{ marginTop: '2px' }} />
                          <Text style={{ fontSize: '0.9375rem', color: '#666' }}>{bin.notes}</Text>
                        </Group>
                      )}
                    </Stack>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <Text 
                      style={{ 
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#1c1c1c',
                        marginBottom: '0.5rem'
                      }}
                    >
                      {bin.calculatedDistance ? `${bin.calculatedDistance} km` : bin.distance}
                    </Text>
                    {userLocation && bin.calculatedDistance && (
                      <Badge 
                        size="sm"
                        style={{ 
                          backgroundColor: '#f4f4f4', 
                          color: '#666',
                          fontWeight: 500,
                          marginBottom: '1rem'
                        }}
                      >
                        From your location
                      </Badge>
                    )}
                    <div>
                      <Button 
                        size="sm" 
                        style={{
                          backgroundColor: '#1c1c1c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 500,
                          padding: '8px 12px',
                          fontSize: '0.875rem'
                        }}
                        leftIcon={<IconMapPin size="14px" />}
                        component="a"
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(bin.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </Stack>

          {/* Pagination */}
          {filteredBins.length > itemsPerPage && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Pagination
                page={currentPage}
                onChange={setCurrentPage}
                total={totalPages}
                size="md"
                radius="8px"
                withEdges
                styles={{
                  control: {
                    border: '1px solid #e1e2e3',
                    color: '#666',
                    '&[data-active]': {
                      backgroundColor: 'var(--hh-primary-darkest)',
                      borderColor: 'var(--hh-primary-darkest)',
                      color: 'white'
                    },
                    '&:hover:not([data-active])': {
                      backgroundColor: 'var(--hh-lightest)',
                      borderColor: 'var(--hh-primary-dark)',
                      color: 'var(--hh-primary-darkest)'
                    }
                  }
                }}
              />
            </div>
          )}

          {/* Pagination Info */}
          {filteredBins.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Text style={{ fontSize: '0.875rem', color: '#666' }}>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredBins.length)} of {filteredBins.length} locations
              </Text>
            </div>
          )}

          {filteredBins.length === 0 && (
            <div style={{ marginTop: '2rem' }}>
              <Alert 
                icon={<IconInfoCircle size="1rem" />} 
                title="No bins found"
                style={{
                  backgroundColor: '#fefbf2',
                  borderColor: '#fcd34d',
                  color: '#92400e',
                  borderRadius: '8px'
                }}
              >
                No donation bins match your current search criteria. Try adjusting your filters or search terms.
              </Alert>
            </div>
          )}
        </div>
      </Container>

      {/* Help Section */}
      <Box style={{ backgroundColor: 'white', borderTop: '1px solid #e1e2e3' }}>
        <Container size="xl" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <Title 
              order={2} 
              style={{ 
                fontSize: '2rem',
                fontWeight: 600,
                color: '#1c1c1c',
                marginBottom: '1rem'
              }}
            >
              Can't find a bin near you?
            </Title>
            <Text 
              style={{ 
                fontSize: '1.125rem',
                color: '#666',
                lineHeight: 1.6,
                marginBottom: '2.5rem'
              }}
            >
              We're constantly expanding our network of donation bins. Contact us to suggest 
              a new location or ask about hosting a bin in your community.
            </Text>
            
            <Group justify="center" spacing="1rem">
              <Button 
                size="lg"
                style={{
                  backgroundColor: '#1c1c1c',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px'
                }}
              >
                Suggest a Location
              </Button>
              <Button 
                size="lg"
                variant="outline"
                style={{
                  borderColor: '#e1e2e3',
                  color: '#666',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  backgroundColor: 'white'
                }}
              >
                Host a Bin
              </Button>
            </Group>
          </div>
        </Container>
      </Box>
    </Box>
  );
};

export default FindBin;