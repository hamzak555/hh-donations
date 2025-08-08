import React from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Grid, 
  Image, 
  Stack, 
  Group, 
  Box,
  SimpleGrid,
  Card,
  Badge
} from '@mantine/core';
import { 
  IconArrowRight, 
  IconHeart, 
  IconUsers,
  IconGlobe,
  IconRecycle,
  IconTarget,
  IconMail,
  IconCheck,
  IconMapPin
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import placeholder1 from '../assets/placeholder1.jpg';
import placeholder2 from '../assets/placeholder2.jpg';
import placeholder3 from '../assets/placeholder3.jpg';
import placeholder4 from '../assets/placeholder4.jpg';
import placeholder5 from '../assets/placeholder5.jpg';
import placeholder6 from '../assets/placeholder6.jpg';

const About = () => {
  const stats = [
    { number: '1M+', label: 'Items Donated' },
    { number: '15+', label: 'Countries Served' },
    { number: '500K+', label: 'People Helped' },
    { number: '2014', label: 'Founded' }
  ];

  const values = [
    {
      icon: IconHeart,
      title: 'Compassion',
      description: 'Driven by empathy and understanding for those in need.'
    },
    {
      icon: IconGlobe,
      title: 'Global Impact',
      description: 'Building bridges across communities worldwide.'
    },
    {
      icon: IconRecycle,
      title: 'Sustainability',
      description: 'Reducing waste while creating meaningful change.'
    },
    {
      icon: IconUsers,
      title: 'Community',
      description: 'Fostering connections through shared purpose.'
    }
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      description: 'Passionate about sustainable giving and global impact.',
      image: placeholder1
    },
    {
      name: 'Michael Chen',
      role: 'Operations Director',
      description: 'Ensuring efficient distribution and logistics worldwide.',
      image: placeholder2
    },
    {
      name: 'Elena Rodriguez',
      role: 'Partnership Manager',
      description: 'Building relationships with NGOs and communities.',
      image: placeholder3
    },
    {
      name: 'David Thompson',
      role: 'Sustainability Coordinator',
      description: 'Developing eco-friendly processes and initiatives.',
      image: placeholder4
    }
  ];

  return (
    <Box style={{ 
      backgroundColor: '#fafafa',
      color: '#1c1c1c',
      fontFamily: '"Cal Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      minHeight: '100vh'
    }}>
      {/* Our Story Section */}
      <Container size="xl" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
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
            Our story
          </Title>
          <Text
            style={{
              fontSize: '1.125rem',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
How an Ottawa not-for-profit creates measurable global impact
          </Text>
        </div>

        <Card
          padding="3rem"
          radius="16px"
          style={{
            backgroundColor: 'white',
            border: '1px solid #e1e2e3',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            marginBottom: '4rem'
          }}
        >
          <Stack spacing="2rem">
            <Text
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.7,
                color: '#666'
              }}
            >
              H&H Donations was founded in 2014 in Ottawa with a clear mission: create a transparent, 
              efficient system for connecting local clothing donations with families experiencing 
              clothing shortages worldwide.
            </Text>
            <Text
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.7,
                color: '#666'
              }}
            >
              Every step from collection to delivery is documented to ensure full transparency 
              and provide clear, measurable data on the social and environmental impact of each donation. 
              We operate with the support of our partner locations to promote environmental sustainability 
              and reduce textile waste.
            </Text>
            <Text
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.7,
                color: '#1c1c1c',
                fontWeight: 600,
                borderLeft: '3px solid #2563eb',
                paddingLeft: '1rem',
                fontStyle: 'italic'
              }}
            >
              "Hosting a bin is a simple way to be part of this mission. Together, we can make 
              giving back simple, impactful, and local."
            </Text>
          </Stack>
        </Card>
      </Container>

      {/* Values Section */}
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
              Our values
            </Title>
            <Text
              style={{
                fontSize: '1.125rem',
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              The principles that guide everything we do
            </Text>
          </div>
          
          <SimpleGrid cols={2} spacing="2rem" breakpoints={[{ maxWidth: 768, cols: 1 }]}>
            {values.map((value, index) => (
              <Card
                key={index}
                padding="2rem"
                radius="12px"
                style={{
                  backgroundColor: '#fafafa',
                  border: '1px solid #e1e2e3',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <Stack spacing="1.5rem">
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#1c1c1c',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <value.icon size="24px" color="white" />
                  </div>
                  
                  <Title
                    order={4}
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: '#1c1c1c'
                    }}
                  >
                    {value.title}
                  </Title>
                  
                  <Text
                    style={{
                      color: '#666',
                      lineHeight: 1.5,
                      fontSize: '0.9375rem'
                    }}
                  >
                    {value.description}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Team Section */}
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
            Meet the team
          </Title>
          <Text
            style={{
              fontSize: '1.125rem',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            The people working to make clothing donations accessible to everyone
          </Text>
        </div>
        
        <SimpleGrid cols={4} spacing="2rem" breakpoints={[{ maxWidth: 768, cols: 2 }, { maxWidth: 480, cols: 1 }]}>
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              padding="1.5rem"
              radius="12px"
              style={{
                backgroundColor: 'white',
                border: '1px solid #e1e2e3',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                textAlign: 'center'
              }}
            >
              <Stack spacing="1rem">
                <Image
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto'
                  }}
                />
                <div>
                  <Title
                    order={5}
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#1c1c1c',
                      marginBottom: '0.25rem'
                    }}
                  >
                    {member.name}
                  </Title>
                  <Text
                    style={{
                      fontSize: '0.875rem',
                      color: '#2563eb',
                      fontWeight: 500,
                      marginBottom: '0.5rem'
                    }}
                  >
                    {member.role}
                  </Text>
                  <Text
                    style={{
                      fontSize: '0.8125rem',
                      color: '#666',
                      lineHeight: 1.4
                    }}
                  >
                    {member.description}
                  </Text>
                </div>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* CTA Section */}
      <Box style={{ backgroundColor: '#1c1c1c', color: 'white' }}>
        <Container size="xl" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <Title
              order={2}
              style={{
                fontSize: '2.5rem',
                fontWeight: 600,
                marginBottom: '1.5rem'
              }}
            >
              Ready to get started?
            </Title>
            <Text
              style={{
                fontSize: '1.125rem',
                opacity: 0.9,
                marginBottom: '2.5rem',
                lineHeight: 1.6
              }}
            >
              Join thousands of people making a difference through sustainable giving. 
              Find your nearest donation location and start helping families today.
            </Text>
            
            <Group position="center" spacing="1rem">
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
                to="/contact"
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
                rightIcon={<IconMail size="1rem" />}
              >
                Get in touch
              </Button>
            </Group>
          </div>
        </Container>
      </Box>
    </Box>
  );
};

export default About;