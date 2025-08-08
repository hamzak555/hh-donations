import React from 'react';
import { Container, Title, Text, Stack, Grid, Group } from '@mantine/core';
import { Button as MantineButton } from '@mantine/core';
import { IconHeart, IconStar } from '@tabler/icons-react';
import { Heart, Star, MapPin } from 'lucide-react';

// Shadcn/UI Components
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const ComponentDemo = () => {
  return (
    <Container size="xl" py="xl">
      <Stack spacing="3rem">
        <div className="text-center">
          <Title order={1} className="text-4xl font-bold text-gray-900 mb-4">
            Component Library Integration
          </Title>
          <Text size="lg" className="text-gray-600 max-w-2xl mx-auto">
            This page demonstrates both Mantine UI and Shadcn/UI components working together seamlessly
          </Text>
        </div>

        <Grid>
          {/* Mantine Section */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack spacing="lg">
              <Title order={2} style={{ color: 'var(--hh-primary-dark)' }}>
                Mantine UI Components
              </Title>
              
              <Group spacing="md">
                <MantineButton 
                  size="lg" 
                  leftIcon={<IconHeart size="1rem" />}
                  style={{ backgroundColor: 'var(--hh-primary)' }}
                >
                  Mantine Button
                </MantineButton>
                <MantineButton variant="outline" size="lg" leftIcon={<IconStar size="1rem" />}>
                  Outline Button
                </MantineButton>
              </Group>

              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '1.5rem'
              }}>
                <Title order={4} mb="md">Mantine Card Style</Title>
                <Text color="dimmed">
                  This is a traditional Mantine card with custom styling using the existing 
                  component system and styling approach.
                </Text>
              </div>
            </Stack>
          </Grid.Col>

          {/* Shadcn/UI Section */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack spacing="lg">
              <Title order={2} style={{ color: 'var(--hh-primary-dark)' }}>
                Shadcn/UI Components
              </Title>
              
              <div className="flex gap-3">
                <Button size="lg" className="bg-[#458B7A] hover:bg-[#094C3B]">
                  <Heart className="mr-2 h-4 w-4" />
                  Shadcn Button
                </Button>
                <Button variant="outline" size="lg">
                  <Star className="mr-2 h-4 w-4" />
                  Outline Button
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Shadcn/UI Card</CardTitle>
                  <CardDescription>
                    This is a Shadcn/UI card component with Tailwind CSS styling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Built with Radix UI primitives and styled with Tailwind CSS classes,
                    providing consistent design tokens and accessibility features.
                  </p>
                </CardContent>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Combined Examples */}
        <div className="space-y-8">
          <Title order={2} style={{ color: 'var(--hh-primary-dark)' }} className="text-center">
            Combined Usage Examples
          </Title>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 - Mixed styling */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Donation Impact</CardTitle>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <CardDescription>Track your donation history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Text size="sm" className="text-gray-600">Items Donated</Text>
                    <Text weight={600} className="text-2xl">24</Text>
                  </div>
                  <Button className="w-full bg-[#094C3B] hover:bg-[#458B7A]">
                    <MapPin className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 - Pure Shadcn */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Find Locations</CardTitle>
                  <Badge>New</Badge>
                </div>
                <CardDescription>Nearest donation bins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#094C3B]">12</p>
                    <p className="text-sm text-gray-600">Bins nearby</p>
                  </div>
                  <Button variant="outline" className="w-full border-[#094C3B] text-[#094C3B] hover:bg-[#094C3B] hover:text-white">
                    Find Bins
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 - Mantine with Tailwind classes */}
            <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <Title order={4} className="text-lg font-semibold">Community</Title>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Growing
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold" style={{ color: 'var(--hh-primary-dark)' }}>1.2K</p>
                  <Text size="sm" className="text-gray-600">Active members</Text>
                </div>
                <MantineButton 
                  fullWidth 
                  variant="outline" 
                  style={{ 
                    borderColor: 'var(--hh-primary-dark)', 
                    color: 'var(--hh-primary-dark)' 
                  }}
                  className="hover:bg-[#094C3B] hover:text-white hover:border-[#094C3B]"
                >
                  Join Community
                </MantineButton>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <Title order={3} className="text-blue-900 mb-4">Integration Tips</Title>
            <div className="space-y-3 text-blue-800">
              <p className="text-sm">
                <strong>Mantine Components:</strong> Use for complex components like forms, tables, and layout systems
              </p>
              <p className="text-sm">
                <strong>Shadcn/UI Components:</strong> Use for simple, reusable components like buttons, cards, and badges
              </p>
              <p className="text-sm">
                <strong>Styling:</strong> Mix Mantine's inline styles with Tailwind classes for maximum flexibility
              </p>
              <p className="text-sm">
                <strong>Brand Colors:</strong> Both systems can use your CSS custom properties (--hh-primary-dark, etc.)
              </p>
            </div>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default ComponentDemo;