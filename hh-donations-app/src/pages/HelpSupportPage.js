import React, { useState } from 'react';
import { 
  Button, 
  Group, 
  Paper, 
  SimpleGrid, 
  Text, 
  Textarea, 
  TextInput, 
  Container, 
  Title,
  Stack,
  Box,
  Divider,
  ThemeIcon,
  Notification,
  Card,
  Image,
  BackgroundImage
} from '@mantine/core';
import { IconMail, IconUser, IconMessageCircle, IconCheck, IconHeart, IconPhone } from '@tabler/icons-react';
import placeholder5 from '../assets/Placeholder 5.jpg';
import hhLogoGreen from '../assets/HH Logo Green.png';

export function HelpSupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box style={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, var(--hh-light) 0%, #ffffff 100%)`,
      padding: '2rem 0'
    }}>
      <Container size="lg">
        <Stack spacing="xl">
          <Box ta="center" mb="xl">
            <Image 
              src={hhLogoGreen} 
              alt="HH Donations Logo" 
              width={120} 
              mx="auto" 
              mb="lg"
              style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
            />
            <Title 
              order={1} 
              size="h1" 
              mb="md"
              style={{ color: 'var(--hh-primary-dark)' }}
            >
              Help & Support
            </Title>
            <Text size="lg" c="dimmed" maw={600} mx="auto">
              We're here to help! Whether you have questions about donations, need technical support, 
              or want to learn more about our mission, don't hesitate to reach out.
            </Text>
          </Box>

          {submitted && (
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <Notification 
                icon={<IconCheck size="1.1rem" />} 
                color="teal" 
                title="Message sent successfully!"
                onClose={() => setSubmitted(false)}
                style={{ maxWidth: 400 }}
              >
                Thank you for contacting us. We'll get back to you within 24 hours.
              </Notification>
            </Box>
          )}

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" style={{ width: '100%' }}>
            <Box style={{ 
              background: 'var(--hh-white)',
              border: '2px solid var(--hh-light)',
              borderRadius: '12px',
              padding: '2rem',
              height: 'fit-content'
            }}>
              <Stack spacing="lg">
                <Box ta="center">
                  <ThemeIcon 
                    size={60} 
                    radius="xl" 
                    mx="auto"
                    mb="md"
                    style={{ backgroundColor: 'var(--hh-primary)', color: 'white' }}
                  >
                    <IconHeart size="2rem" />
                  </ThemeIcon>
                  <Title order={2} size="h4" mb="sm" style={{ color: 'var(--hh-primary-dark)' }}>
                    Our Mission
                  </Title>
                  <Text c="dimmed" size="sm">
                    Dedicated to making a positive impact through charitable donations and community support.
                  </Text>
                </Box>
              </Stack>
            </Box>

            <Box style={{ 
              background: 'var(--hh-white)',
              border: '2px solid var(--hh-light)',
              borderRadius: '12px',
              padding: '2rem',
              height: 'fit-content'
            }}>
              <Stack spacing="lg">
                <Box>
                  <Title order={2} size="h4" mb="md" ta="center" style={{ color: 'var(--hh-primary-dark)' }}>
                    Contact Information
                  </Title>
                  <Text c="dimmed" size="sm" ta="center" mb="lg">
                    Our team is available Monday through Friday, 9 AM to 5 PM EST.
                  </Text>
                </Box>

                <Stack spacing="md">
                  <Group>
                    <ThemeIcon 
                      size="lg" 
                      radius="xl" 
                      style={{ backgroundColor: 'var(--hh-primary)', color: 'white' }}
                    >
                      <IconMail size="1.1rem" />
                    </ThemeIcon>
                    <Box>
                      <Text fw={500}>Email</Text>
                      <Text size="sm" c="dimmed">support@hhdonations.org</Text>
                    </Box>
                  </Group>

                  <Group>
                    <ThemeIcon 
                      size="lg" 
                      radius="xl" 
                      style={{ backgroundColor: 'var(--hh-primary)', color: 'white' }}
                    >
                      <IconPhone size="1.1rem" />
                    </ThemeIcon>
                    <Box>
                      <Text fw={500}>Phone</Text>
                      <Text size="sm" c="dimmed">(555) 123-4567</Text>
                    </Box>
                  </Group>

                  <Group>
                    <ThemeIcon 
                      size="lg" 
                      radius="xl" 
                      style={{ backgroundColor: 'var(--hh-primary)', color: 'white' }}
                    >
                      <IconMessageCircle size="1.1rem" />
                    </ThemeIcon>
                    <Box>
                      <Text fw={500}>Response Time</Text>
                      <Text size="sm" c="dimmed">Usually within 24 hours</Text>
                    </Box>
                  </Group>
                </Stack>
              </Stack>
            </Box>

            <Box 
              style={{ 
                background: `linear-gradient(rgba(9, 76, 59, 0.8), rgba(9, 76, 59, 0.8)), url(${placeholder5})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '2px solid var(--hh-light)',
                borderRadius: '12px',
                padding: '2rem',
                height: 'fit-content',
                color: 'white'
              }}
            >
              <Stack spacing="lg">
                <Box ta="center">
                  <Title order={2} size="h4" mb="md" style={{ color: 'white' }}>
                    Get Involved
                  </Title>
                  <Text size="sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    Join our community of volunteers and donors making a difference in people's lives every day.
                  </Text>
                </Box>
              </Stack>
            </Box>
          </SimpleGrid>

          <Box style={{ 
            background: 'var(--hh-white)',
            border: '2px solid var(--hh-light)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '800px',
            margin: '0 auto',
            width: '100%'
          }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing="md">
                <Title order={2} size="h3" ta="center" style={{ color: 'var(--hh-primary-dark)' }}>
                  Send us a message
                </Title>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <TextInput 
                    label="Full Name" 
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    leftSection={<IconUser size="1rem" />}
                    radius="md"
                    required
                  />
                  <TextInput 
                    label="Email Address" 
                    placeholder="your.email@example.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    leftSection={<IconMail size="1rem" />}
                    radius="md"
                    required 
                  />
                </SimpleGrid>

                <TextInput 
                  label="Subject" 
                  placeholder="What can we help you with?"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  radius="md"
                  required 
                />

                <Textarea
                  label="Message"
                  placeholder="Please provide details about your question or concern..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  minRows={4}
                  radius="md"
                  required
                />

                <Group justify="center" mt="lg">
                  <Button 
                    type="submit" 
                    size="lg"
                    radius="md"
                    style={{ 
                      backgroundColor: 'var(--hh-primary)',
                      '&:hover': { backgroundColor: 'var(--hh-primary-dark)' }
                    }}
                  >
                    Send Message
                  </Button>
                </Group>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default HelpSupportPage;