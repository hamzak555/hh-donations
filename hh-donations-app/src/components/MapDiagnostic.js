import React, { useEffect, useState } from 'react';
import { Card, Text, Stack, Group, Alert, Badge, Code } from '@mantine/core';
import { IconInfoCircle, IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-react';

const MapDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState({
    apiKeyPresent: false,
    googleMapsLoaded: false,
    networkConnected: true,
    consoleErrors: [],
    apiKeyValue: '',
    timestamp: new Date().toLocaleString()
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      const results = { ...diagnostics };
      
      // Check API key
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyAOX2t7VI8Y0dQAWvgpHq9dzKjD01ZFK6w';
      results.apiKeyPresent = !!apiKey;
      results.apiKeyValue = apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found';
      
      // Check if Google Maps is loaded
      results.googleMapsLoaded = !!(window.google && window.google.maps);
      
      // Check network connectivity
      results.networkConnected = navigator.onLine;
      
      // Test API endpoint
      try {
        const testUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__testCallback`;
        console.log('Testing Google Maps API endpoint:', testUrl);
      } catch (error) {
        results.consoleErrors.push(`API test error: ${error.message}`);
      }

      // Capture any console errors
      const originalError = console.error;
      console.error = (...args) => {
        results.consoleErrors.push(args.join(' '));
        originalError.apply(console, args);
      };

      setDiagnostics(results);
    };

    runDiagnostics();
  }, []);

  const getDiagnosticIcon = (status) => {
    if (status === true) return <IconCheck size="1rem" color="green" />;
    if (status === false) return <IconX size="1rem" color="red" />;
    return <IconAlertTriangle size="1rem" color="orange" />;
  };

  const getDiagnosticColor = (status) => {
    if (status === true) return "green";
    if (status === false) return "red";
    return "orange";
  };

  return (
    <Card shadow="sm" padding="xl" radius="md">
      <Stack spacing="md">
        <Group>
          <IconInfoCircle size="1.5rem" color="var(--hh-primary)" />
          <Text size="lg" weight={600} style={{ color: 'var(--hh-primary-dark)' }}>
            Google Maps Diagnostic Report
          </Text>
        </Group>
        
        <Text size="sm" color="dimmed">
          Generated: {diagnostics.timestamp}
        </Text>

        <Stack spacing="sm">
          <Group>
            {getDiagnosticIcon(diagnostics.apiKeyPresent)}
            <Text size="sm">
              API Key Present: 
              <Badge ml="xs" color={getDiagnosticColor(diagnostics.apiKeyPresent)}>
                {diagnostics.apiKeyPresent ? 'Yes' : 'No'}
              </Badge>
            </Text>
          </Group>
          
          {diagnostics.apiKeyPresent && (
            <Text size="xs" color="dimmed" style={{ marginLeft: '2rem' }}>
              Key: {diagnostics.apiKeyValue}
            </Text>
          )}

          <Group>
            {getDiagnosticIcon(diagnostics.googleMapsLoaded)}
            <Text size="sm">
              Google Maps Loaded: 
              <Badge ml="xs" color={getDiagnosticColor(diagnostics.googleMapsLoaded)}>
                {diagnostics.googleMapsLoaded ? 'Yes' : 'No'}
              </Badge>
            </Text>
          </Group>

          <Group>
            {getDiagnosticIcon(diagnostics.networkConnected)}
            <Text size="sm">
              Network Connected: 
              <Badge ml="xs" color={getDiagnosticColor(diagnostics.networkConnected)}>
                {diagnostics.networkConnected ? 'Yes' : 'No'}
              </Badge>
            </Text>
          </Group>
        </Stack>

        {diagnostics.consoleErrors.length > 0 && (
          <Alert icon={<IconAlertTriangle size="1rem" />} title="Console Errors" color="red">
            <Stack spacing="xs">
              {diagnostics.consoleErrors.slice(0, 3).map((error, index) => (
                <Code key={index} color="red" style={{ fontSize: '12px' }}>
                  {error.substring(0, 100)}...
                </Code>
              ))}
            </Stack>
          </Alert>
        )}

        <Alert icon={<IconInfoCircle size="1rem" />} title="Troubleshooting Steps" color="blue">
          <Stack spacing="xs">
            <Text size="sm">1. Check browser console for detailed error messages</Text>
            <Text size="sm">2. Verify API key has Maps JavaScript API enabled</Text>
            <Text size="sm">3. Check if billing is enabled in Google Cloud Console</Text>
            <Text size="sm">4. Ensure domain restrictions allow localhost/your domain</Text>
            <Text size="sm">5. Test the standalone map-test.html file</Text>
          </Stack>
        </Alert>
      </Stack>
    </Card>
  );
};

export default MapDiagnostic;