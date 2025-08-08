import React from 'react';
import { Container, Title, Text, Stack } from '@mantine/core';

const Homepage = () => {
  return (
    <Container size="lg" py="xl">
      <Stack align="center" justify="center" style={{ minHeight: '80vh' }}>
        <Title order={1} size="h1" style={{ fontSize: '3rem' }}>
          Welcome to HH Donations
        </Title>
        <Text size="xl" color="dimmed" align="center" style={{ maxWidth: 600 }}>
          Your platform for making a difference. Start exploring our donation campaigns and join our community of changemakers.
        </Text>
      </Stack>
    </Container>
  );
};

export default Homepage;