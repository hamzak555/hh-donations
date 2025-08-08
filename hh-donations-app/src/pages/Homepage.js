import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Stack, 
  Group, 
  SimpleGrid,
  Box,
  Grid,
  Card,
  Badge,
  Flex,
  Progress,
  Avatar,
  Image
} from '@mantine/core';
import { 
  IconArrowRight,
  IconMapPin,
  IconGlobe,
  IconHeart,
  IconUsers,
  IconTrendingUp,
  IconStar,
  IconQuote,
  IconPlayerPlay,
  IconChevronRight,
  IconAward,
  IconShield,
  IconTarget,
  IconCheck,
  IconTruck,
  IconGift
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const stats = [
    { 
      value: '15K+', 
      label: 'Families helped',
      description: 'Across Canada and beyond'
    },
    { 
      value: '98%', 
      label: 'Direct impact',
      description: 'Donations reach families'
    },
    { 
      value: '200+', 
      label: 'Collection points',
      description: 'Convenient locations'
    },
    { 
      value: '24/7', 
      label: 'Always open',
      description: 'Donate anytime'
    }
  ];

  const features = [
    {
      icon: IconMapPin,
      title: "♻️ Collect gently used clothing",
      description: "We gather donations from local Ottawa communities through our network of convenient drop-off locations."
    },
    {
      icon: IconTruck,
      title: "🚛 Transport to countries in need",
      description: "We sort, ship, and distribute garments to under-resourced regions experiencing clothing shortages."
    },
    {
      icon: IconGift,
      title: "📊 Full transparency and tracking",
      description: "Every step from collection to delivery is documented to ensure clear, measurable impact data."
    }
  ];

  const benefits = [
    "Collect gently used clothing from local communities",
    "Transport donations to countries experiencing clothing shortages", 
    "Operate with transparency and trackable impact",
    "Create opportunities through sustainable giving",
    "Promote environmental sustainability and reduce textile waste"
  ];

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.7;
            }
          }
        `}
      </style>
      <Box style={{ backgroundColor: '#fafafa', minHeight: '100vh', fontFamily: '"Cal Sans", -apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Hero Section with Stacked Images */}
      <Container size="xl" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <Grid gutter="xl" align="center">
          {/* Left Content */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack spacing="2rem">
              <Badge
                variant="light"
                size="lg"
                style={{
                  backgroundColor: 'var(--hh-lightest)',
                  color: 'var(--hh-primary-darkest)',
                  border: '1px solid var(--hh-light)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  padding: '8px 16px'
                }}
              >
                🇨🇦 Ottawa-based • Serving families worldwide
              </Badge>
              
              <Title
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: '#1c1c1c',
                  letterSpacing: '-0.025em'
                }}
              >
                Gently used clothing, global impact
              </Title>
              
              <Text
                style={{
                  fontSize: '1.25rem',
                  color: '#4a5568',
                  lineHeight: 1.6,
                  maxWidth: '500px',
                  fontWeight: 400
                }}
              >
                H&H Donations is an Ottawa-based not‑for‑profit that gathers gently used clothing from local communities, 
                then sorts, ships, and distributes these garments to under‑resourced regions worldwide.
              </Text>

              
              <Group spacing="1rem" style={{ paddingTop: '1rem' }}>
                <Button
                  component={Link}
                  to="/find-bin"
                  size="xl"
                  style={{
                    backgroundColor: 'var(--hh-primary-darkest)',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    padding: '16px 32px',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(9, 76, 59, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                  rightIcon={<IconMapPin size="1.25rem" />}
                >
                  Find Donation Bins
                </Button>
                
                <Button
                  component={Link}
                  to="/about"
                  variant="outline"
                  size="xl"
                  style={{
                    borderColor: 'var(--hh-primary-dark)',
                    color: 'var(--hh-primary-darkest)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    padding: '16px 32px',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    borderWidth: '2px'
                  }}
                  leftIcon={<IconHeart size="1.25rem" />}
                >
                  Our Story
                </Button>
              </Group>
            </Stack>
          </Grid.Col>

          {/* Right Images - Stacked Layout */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Box style={{ position: 'relative', height: '600px' }}>
              {/* Main Large Image */}
              <Box
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  width: '65%',
                  height: '45%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  zIndex: 3
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Volunteers sorting clothing donations"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>

              {/* Second Image - Family receiving donations */}
              <Box
                style={{
                  position: 'absolute',
                  top: '25%',
                  left: '0',
                  width: '55%',
                  height: '40%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                  zIndex: 2
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Family receiving clothing donations"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>

              {/* Third Image - Donation bin */}
              <Box
                style={{
                  position: 'absolute',
                  bottom: '10%',
                  right: '5%',
                  width: '50%',
                  height: '35%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 1
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Community donation bin"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>


              {/* Background decoration */}
              <Box
                style={{
                  position: 'absolute',
                  top: '-10%',
                  right: '-10%',
                  width: '200px',
                  height: '200px',
                  background: `linear-gradient(135deg, var(--hh-light) 0%, var(--hh-accent) 100%)`,
                  borderRadius: '50%',
                  opacity: 0.1,
                  zIndex: 0
                }}
              />
            </Box>
          </Grid.Col>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container size="xl" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
        <SimpleGrid cols={3} spacing="2rem" breakpoints={[{ maxWidth: 768, cols: 1 }]}>
          {features.map((feature, index) => (
            <Card
              key={index}
              padding="2rem"
              radius="12px"
              style={{
                backgroundColor: 'white',
                border: '1px solid #e1e2e3',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#f4f4f4',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto'
                }}
              >
                <feature.icon size="24px" color="#666" />
              </div>
              
              <Title
                order={3}
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#1c1c1c',
                  marginBottom: '0.75rem'
                }}
              >
                {feature.title}
              </Title>
              
              <Text
                style={{
                  color: '#666',
                  lineHeight: 1.5,
                  fontSize: '0.9375rem'
                }}
              >
                {feature.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Stats Section */}
      <Box style={{ backgroundColor: 'white', borderTop: '1px solid #e1e2e3', borderBottom: '1px solid #e1e2e3' }}>
        <Container size="xl" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <SimpleGrid cols={4} spacing="2rem" breakpoints={[{ maxWidth: 768, cols: 2 }, { maxWidth: 480, cols: 1 }]}>
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <Text
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: '#1c1c1c',
                    lineHeight: 1,
                    marginBottom: '0.5rem'
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1c1c1c',
                    marginBottom: '0.25rem'
                  }}
                >
                  {stat.label}
                </Text>
                <Text
                  style={{
                    fontSize: '0.875rem',
                    color: '#666'
                  }}
                >
                  {stat.description}
                </Text>
              </div>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Benefits Section */}
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
            Why choose H&H Donations?
          </Title>
          <Text
            style={{
              fontSize: '1.125rem',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            We make donating clothing simple, transparent, and impactful
          </Text>
        </div>

        <Card
          padding="3rem"
          radius="16px"
          style={{
            backgroundColor: 'white',
            border: '1px solid #e1e2e3',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <SimpleGrid cols={1} spacing="1.5rem">
            {benefits.map((benefit, index) => (
              <Group key={index} spacing="1rem" align="flex-start">
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#22c55e',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px',
                    flexShrink: 0
                  }}
                >
                  <IconCheck size="12px" color="white" stroke={3} />
                </div>
                <Text
                  style={{
                    fontSize: '1rem',
                    color: '#1c1c1c',
                    fontWeight: 500
                  }}
                >
                  {benefit}
                </Text>
              </Group>
            ))}
          </SimpleGrid>
        </Card>
      </Container>

      {/* How It Works Section */}
      <Box style={{ backgroundColor: '#f9fafb', paddingTop: '6rem', paddingBottom: '6rem' }}>
        <Container size="xl">
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
              How donation works
            </Title>
            <Text
              style={{
                fontSize: '1.125rem',
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              Simple steps to make a lasting impact
            </Text>
          </div>

          <SimpleGrid cols={4} spacing="2rem" breakpoints={[{ maxWidth: 768, cols: 2 }, { maxWidth: 480, cols: 1 }]}>
            {[
              {
                step: '01',
                title: 'Sort your clothes',
                description: 'Gather gently used clothing items from your wardrobe',
                icon: IconGift
              },
              {
                step: '02',
                title: 'Find a bin',
                description: 'Locate your nearest H&H donation bin using our map',
                icon: IconMapPin
              },
              {
                step: '03',
                title: 'Drop off items',
                description: 'Visit the location and place items in the secure bin',
                icon: IconTruck
              },
              {
                step: '04',
                title: 'Track impact',
                description: 'See how your donations help families worldwide',
                icon: IconHeart
              }
            ].map((step, index) => (
              <Card
                key={index}
                padding="2rem"
                radius="12px"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e1e2e3',
                  textAlign: 'center',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'var(--hh-primary-darkest)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto'
                  }}
                >
                  <step.icon size="28px" color="white" />
                </div>
                
                <Text
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#cbd5e0',
                    letterSpacing: '0.1em'
                  }}
                >
                  {step.step}
                </Text>

                <Title
                  order={4}
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#1c1c1c',
                    marginBottom: '0.75rem'
                  }}
                >
                  {step.title}
                </Title>
                
                <Text
                  style={{
                    color: '#666',
                    fontSize: '0.9375rem',
                    lineHeight: 1.5
                  }}
                >
                  {step.description}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Testimonials Section */}
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
            Stories from our community
          </Title>
          <Text
            style={{
              fontSize: '1.125rem',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Real people, real impact - hear from donors and recipients
          </Text>
        </div>

        <SimpleGrid cols={2} spacing="2rem" breakpoints={[{ maxWidth: 768, cols: 1 }]}>
          {[
            {
              quote: "I love how easy it is to find donation bins in my neighborhood. Knowing that my old clothes are helping families internationally makes me feel great about decluttering.",
              author: "Sarah M.",
              role: "Regular Donor, Ottawa",
              avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b932?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
            },
            {
              quote: "H&H Donations provided warm clothing for my family during a difficult time. The quality and care in their work is evident - they truly make a difference.",
              author: "Maria L.",
              role: "Recipient, Guatemala",
              avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
            }
          ].map((testimonial, index) => (
            <Card
              key={index}
              padding="2.5rem"
              radius="12px"
              style={{
                backgroundColor: 'white',
                border: '1px solid #e1e2e3',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <IconQuote 
                size="32px" 
                color="#e1e2e3" 
                style={{ marginBottom: '1rem' }}
              />
              
              <Text
                style={{
                  fontSize: '1.125rem',
                  color: '#1c1c1c',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                  fontStyle: 'italic'
                }}
              >
                "{testimonial.quote}"
              </Text>
              
              <Group spacing="1rem" align="center">
                <Avatar
                  src={testimonial.avatar}
                  size="md"
                  radius="xl"
                />
                <div>
                  <Text
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#1c1c1c'
                    }}
                  >
                    {testimonial.author}
                  </Text>
                  <Text
                    style={{
                      fontSize: '0.875rem',
                      color: '#666'
                    }}
                  >
                    {testimonial.role}
                  </Text>
                </div>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Impact Visualization */}
      <Box style={{ backgroundColor: 'var(--hh-lightest)', paddingTop: '6rem', paddingBottom: '6rem' }}>
        <Container size="xl">
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
              Your donations at work
            </Title>
            <Text
              style={{
                fontSize: '1.125rem',
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              See the real-time impact of our community's generosity
            </Text>
          </div>

          <Card
            padding="3rem"
            radius="16px"
            style={{
              backgroundColor: 'white',
              border: '1px solid #e1e2e3',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <Grid gutter="3rem" align="center">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack spacing="2rem">
                  <div>
                    <Text style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      This Month's Impact
                    </Text>
                    <Text style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--hh-primary-darkest)', marginBottom: '0.5rem' }}>
                      2,847
                    </Text>
                    <Text style={{ fontSize: '1.125rem', color: '#666' }}>
                      clothing items collected and distributed
                    </Text>
                  </div>

                  <div>
                    <Text style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem', fontWeight: 500 }}>
                      Distribution Progress
                    </Text>
                    <Stack spacing="0.75rem">
                      {[
                        { region: 'Central America', progress: 78, items: '1,240 items' },
                        { region: 'Southeast Asia', progress: 65, items: '890 items' },
                        { region: 'Eastern Europe', progress: 45, items: '717 items' }
                      ].map((region, index) => (
                        <div key={index}>
                          <Group position="apart" style={{ marginBottom: '0.25rem' }}>
                            <Text style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1c1c1c' }}>
                              {region.region}
                            </Text>
                            <Text style={{ fontSize: '0.75rem', color: '#666' }}>
                              {region.items}
                            </Text>
                          </Group>
                          <Progress 
                            value={region.progress} 
                            style={{ height: '6px' }}
                            color="var(--hh-primary-dark)"
                            radius="xl"
                          />
                        </div>
                      ))}
                    </Stack>
                  </div>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Box
                  style={{
                    height: '300px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* World map placeholder with animated dots */}
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img
                      src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Global impact map"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.3
                      }}
                    />
                    
                    {/* Animated impact indicators */}
                    {[
                      { top: '25%', left: '20%' },
                      { top: '45%', left: '75%' },
                      { top: '65%', left: '45%' }
                    ].map((position, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'absolute',
                          ...position,
                          width: '12px',
                          height: '12px',
                          backgroundColor: 'var(--hh-primary)',
                          borderRadius: '50%',
                          animation: 'pulse 2s infinite',
                          animationDelay: `${index * 0.5}s`
                        }}
                      />
                    ))}
                  </div>
                </Box>
              </Grid.Col>
            </Grid>
          </Card>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box style={{ backgroundColor: '#1c1c1c', color: 'white' }}>
        <Container size="xl" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <Title
              order={2}
              style={{
                fontSize: '2.5rem',
                fontWeight: 600,
                marginBottom: '2.5rem'
              }}
            >
              Ready to make a difference?
            </Title>
            
            <Group justify="center" spacing="1rem" style={{ marginBottom: '2.5rem' }}>
              <Button
                component={Link}
                to="/find-bin"
                size="lg"
                style={{
                  backgroundColor: 'white',
                  color: '#1c1c1c',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px'
                }}
                rightIcon={<IconMapPin size="1rem" />}
              >
                Find donation bins
              </Button>
              
              <Button
                component={Link}
                to="/about"
                variant="outline"
                size="lg"
                style={{
                  borderColor: '#4a5568',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent'
                }}
              >
                Learn more
              </Button>
            </Group>

            <Text
              style={{
                fontSize: '1.125rem',
                opacity: 0.9,
                lineHeight: 1.6,
                textAlign: 'center'
              }}
            >
              Join thousands of people making an impact in their communities. 
              Find your nearest donation location and start helping families today.
            </Text>
          </div>
        </Container>
      </Box>
      </Box>
    </>
  );
};

export default Homepage;