import React from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Card, 
  Stack, 
  Group, 
  SimpleGrid,
  Box,
  Badge,
  Image
} from '@mantine/core';
import { 
  IconCheck, 
  IconX, 
  IconShirt, 
  IconShoe,
  IconBackpack,
  IconJacket,
  IconMapPin,
  IconHeart,
  IconShield,
  IconRecycle,
  IconGift
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const WhatToDonate = () => {
  const acceptedItems = [
    {
      icon: IconShirt,
      category: 'Clothing',
      description: 'Clean, gently used garments for all ages',
      items: [
        'T-shirts, shirts, and blouses',
        'Pants, jeans, and skirts', 
        'Dresses and formal wear',
        'Sweaters and cardigans',
        'Children\'s clothing (all sizes)',
        'Baby clothes and onesies'
      ],
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      icon: IconShoe,
      category: 'Footwear',
      description: 'Shoes in good condition with minimal wear',
      items: [
        'Casual shoes and sneakers',
        'Dress shoes and boots',
        'Children\'s shoes',
        'Sandals and flip-flops',
        'Athletic shoes in good condition'
      ],
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      icon: IconBackpack,
      category: 'Accessories',
      description: 'Functional accessories and bags',
      items: [
        'Handbags and purses',
        'Backpacks and school bags',
        'Belts and ties',
        'Hats and scarves',
        'Costume jewelry',
        'Working watches'
      ],
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      icon: IconJacket,
      category: 'Outerwear',
      description: 'Jackets and coats for all seasons',
      items: [
        'Winter coats and jackets',
        'Rain jackets and windbreakers',
        'Blazers and suit jackets',
        'Hoodies and sweatshirts',
        'Vests and cardigans'
      ],
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const notAcceptedItems = [
    'Dirty, stained, or torn clothing',
    'Underwear and socks (new items only)',
    'Household items (furniture, dishes, etc.)',
    'Electronics and appliances', 
    'Books and magazines',
    'Toys and games',
    'Bedding and pillows',
    'Shoes with significant wear or damage'
  ];

  const donationGuidelines = [
    {
      icon: IconShield,
      title: 'Quality First',
      description: 'Only donate items you\'d be comfortable giving to a friend. Clean, undamaged clothing has the greatest impact.'
    },
    {
      icon: IconGift,
      title: 'Bag Securely',
      description: 'Use plastic bags or boxes to keep donations clean and organized during transport to our sorting facilities.'
    },
    {
      icon: IconRecycle,
      title: 'Think Sustainability',
      description: 'Your quality donations help reduce textile waste while providing essential clothing to families worldwide.'
    },
    {
      icon: IconHeart,
      title: 'Ottawa to Global',
      description: 'Every item donated in Ottawa is tracked and documented as it travels to help families in under-resourced regions.'
    }
  ];

  return (
    <Box style={{ 
      backgroundColor: '#fafafa',
      color: '#1c1c1c',
      fontFamily: '"Cal Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      minHeight: '100vh'
    }}>
      {/* Hero Section */}
      <Container size="xl" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <Badge
            variant="light"
            style={{
              backgroundColor: '#f4f4f4',
              color: '#666',
              border: '1px solid #e1e2e3',
              fontWeight: 500,
              fontSize: '0.875rem',
              padding: '6px 12px',
              marginBottom: '2rem'
            }}
          >
            Ottawa-based donation guidelines
          </Badge>
          
          <Title
            style={{
              fontSize: 'clamp(3rem, 6vw, 4.5rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              color: '#1c1c1c',
              marginBottom: '1.5rem',
              letterSpacing: '-0.025em'
            }}
          >
            What can I donate?
          </Title>
          
          <Text
            style={{
              fontSize: '1.25rem',
              color: '#666',
              lineHeight: 1.6,
              marginBottom: '3rem',
              maxWidth: '600px',
              margin: '0 auto 3rem auto'
            }}
          >
            We accept gently used clothing and accessories that can make a real difference 
            in the lives of families experiencing clothing shortages worldwide.
          </Text>
          
          <Group position="center" spacing="1rem">
            <Button
              component={Link}
              to="/find-bin"
              size="lg"
              style={{
                backgroundColor: '#1c1c1c',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 500,
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              rightIcon={<IconMapPin size="1rem" />}
            >
              Find donation bins
            </Button>
          </Group>
        </div>
      </Container>

      {/* Accepted Items Section */}
      <Container size="xl" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <Title
            order={2}
            style={{
              fontSize: '2.5rem',
              fontWeight: 600,
              color: '#1c1c1c',
              marginBottom: '1rem'
            }}
          >
            What we accept
          </Title>
          <Text
            style={{
              fontSize: '1.125rem',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            These items, when donated in good condition, help families worldwide
          </Text>
        </div>
        
        <SimpleGrid cols={2} spacing="2rem" breakpoints={[{ maxWidth: 768, cols: 1 }]}>
          {acceptedItems.map((category, index) => (
            <Card
              key={index}
              padding="2rem"
              radius="12px"
              style={{
                backgroundColor: 'white',
                border: '1px solid #e1e2e3',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                height: '100%'
              }}
            >
              <Stack spacing="1.5rem">
                <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <Image
                    src={category.image}
                    alt={category.category}
                    height={200}
                    style={{ objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      width: '48px',
                      height: '48px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <category.icon size="24px" color="#1c1c1c" />
                  </div>
                </div>
                
                <div>
                  <Title
                    order={3}
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      color: '#1c1c1c',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {category.category}
                  </Title>
                  <Text
                    style={{
                      color: '#666',
                      fontSize: '0.9375rem',
                      marginBottom: '1rem'
                    }}
                  >
                    {category.description}
                  </Text>
                </div>
                
                <Stack spacing="0.5rem">
                  {category.items.map((item, itemIndex) => (
                    <Group key={itemIndex} spacing="0.5rem" align="flex-start">
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          backgroundColor: '#22c55e',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '2px',
                          flexShrink: 0
                        }}
                      >
                        <IconCheck size="10px" color="white" stroke={3} />
                      </div>
                      <Text
                        style={{
                          fontSize: '0.875rem',
                          color: '#1c1c1c',
                          fontWeight: 400
                        }}
                      >
                        {item}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Not Accepted Items Section */}
      <Box style={{ backgroundColor: 'white', borderTop: '1px solid #e1e2e3', borderBottom: '1px solid #e1e2e3' }}>
        <Container size="xl" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Title
              order={2}
              style={{
                fontSize: '2.5rem',
                fontWeight: 600,
                color: '#1c1c1c',
                marginBottom: '1rem'
              }}
            >
              Items we cannot accept
            </Title>
            <Text
              style={{
                fontSize: '1.125rem',
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              For safety and quality reasons, these items cannot be processed
            </Text>
          </div>

          <Card
            padding="3rem"
            radius="16px"
            style={{
              backgroundColor: '#fafafa',
              border: '1px solid #e1e2e3',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            <Stack spacing="1rem">
              {notAcceptedItems.map((item, index) => (
                <Group key={index} spacing="1rem" align="flex-start">
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#ef4444',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                      flexShrink: 0
                    }}
                  >
                    <IconX size="12px" color="white" stroke={3} />
                  </div>
                  <Text
                    style={{
                      fontSize: '1rem',
                      color: '#1c1c1c',
                      fontWeight: 500
                    }}
                  >
                    {item}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Card>
        </Container>
      </Box>

      {/* Donation Guidelines Section */}
      <Container size="xl" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <Title
            order={2}
            style={{
              fontSize: '2.5rem',
              fontWeight: 600,
              color: '#1c1c1c',
              marginBottom: '1rem'
            }}
          >
            Donation guidelines
          </Title>
          <Text
            style={{
              fontSize: '1.125rem',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Follow these guidelines to maximize the impact of your donations
          </Text>
        </div>
        
        <SimpleGrid cols={2} spacing="2rem" breakpoints={[{ maxWidth: 768, cols: 1 }]}>
          {donationGuidelines.map((guideline, index) => (
            <Card
              key={index}
              padding="2rem"
              radius="12px"
              style={{
                backgroundColor: 'white',
                border: '1px solid #e1e2e3',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                height: '100%'
              }}
            >
              <Stack spacing="1.5rem">
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#f4f4f4',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <guideline.icon size="24px" color="#666" />
                </div>
                
                <Title
                  order={4}
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#1c1c1c'
                  }}
                >
                  {guideline.title}
                </Title>
                
                <Text
                  style={{
                    color: '#666',
                    lineHeight: 1.5,
                    fontSize: '0.9375rem'
                  }}
                >
                  {guideline.description}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* CTA Section */}
      <Box style={{ 
        backgroundColor: '#1c1c1c', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 30px'
        }} />
        
        <Container size="xl" style={{ paddingTop: '8rem', paddingBottom: '8rem', position: 'relative' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            
            <Title
              order={1}
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: 700,
                marginBottom: '3rem',
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}
            >
              Ready to make a difference?
            </Title>
            
            {/* Primary CTA */}
            <div style={{ marginBottom: '2rem' }}>
              <Button
                component={Link}
                to="/find-bin"
                size="xl"
                style={{
                  backgroundColor: 'white',
                  color: '#1c1c1c',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.2s ease',
                  minWidth: '240px'
                }}
                rightIcon={<IconMapPin size="1.25rem" />}
              >
                Find donation bins
              </Button>
            </div>

            {/* Secondary Action */}
            <Group justify="center" spacing="2rem" style={{ marginBottom: '2rem' }}>
              <Button
                component={Link}
                to="/about"
                variant="subtle"
                size="md"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px'
                }}
              >
                Learn about our mission
              </Button>
              
              <div style={{ 
                width: '1px', 
                height: '20px', 
                backgroundColor: 'rgba(255, 255, 255, 0.3)' 
              }} />
              
              <Text style={{ 
                fontSize: '0.875rem', 
                opacity: 0.7,
                fontWeight: 500
              }}>
                Questions? Contact us anytime
              </Text>
            </Group>

            <Text
              style={{
                fontSize: '1.25rem',
                opacity: 0.9,
                lineHeight: 1.6,
                fontWeight: 400,
                textAlign: 'center'
              }}
            >
              Your gently used clothing can provide warmth, dignity, and hope to families 
              in under-resourced regions worldwide. Every donation is tracked from Ottawa to its final destination.
            </Text>
          </div>
        </Container>
      </Box>

    </Box>
  );
};

export default WhatToDonate;