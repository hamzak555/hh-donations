import React from 'react';
import { Button, Group, Paper, SimpleGrid, Text, Textarea, TextInput, Container, Title } from '@mantine/core';

export function HelpSupportPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted');
  };

  return (
    <Container size="md" py="xl">
      <Title order={1} ta="center" mb="xl">Help & Support</Title>
      
      <Paper shadow="md" radius="lg" p="xl">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <Text size="lg" fw={700} mb="md">
              Contact Information
            </Text>
            <Text c="dimmed">
              Need help? We're here to assist you. Reach out to us using the form below and we'll get back to you as soon as possible.
            </Text>
          </div>

          <form onSubmit={handleSubmit}>
            <Text size="lg" fw={700} mb="md">
              Get in touch
            </Text>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput 
                  label="Your name" 
                  placeholder="Your name" 
                  required
                />
                <TextInput 
                  label="Your email" 
                  placeholder="your.email@example.com" 
                  type="email"
                  required 
                />
              </SimpleGrid>

              <TextInput 
                label="Subject" 
                placeholder="How can we help you?" 
                required 
              />

              <Textarea
                label="Your message"
                placeholder="Please include all relevant information"
                minRows={4}
                required
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit" size="md">
                  Send message
                </Button>
              </Group>
            </div>
          </form>
        </div>
      </Paper>
    </Container>
  );
}

export default HelpSupportPage;