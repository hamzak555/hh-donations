import React from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Grid, 
  TextInput, 
  Select, 
  Button, 
  Group, 
  Paper,
  Stack
} from '@mantine/core';
import DonationCard from '../components/DonationCard';

const DonationsPage = () => {
  const donations = [
    {
      id: 1,
      title: "Clean Water Initiative",
      description: "Help provide clean drinking water to communities in need. Every dollar brings us closer to ensuring safe water access for all.",
      goal: 50000,
      raised: 35000,
      category: "Water"
    },
    {
      id: 2,
      title: "Education for All",
      description: "Support education programs that provide school supplies, books, and learning resources to underprivileged children.",
      goal: 30000,
      raised: 12500,
      category: "Education"
    },
    {
      id: 3,
      title: "Medical Supplies Fund",
      description: "Provide essential medical supplies and equipment to healthcare facilities in underserved areas.",
      goal: 75000,
      raised: 60000,
      category: "Healthcare"
    }
  ];

  return (
    <Container size="lg" py="xl">
      <Stack spacing="xl">
        <div>
          <Title order={1} size="h2" weight={900} align="center">
            Active Donation Campaigns
          </Title>
          <Text color="dimmed" align="center" size="lg" mt="sm">
            Choose a cause that matters to you and make a difference today
          </Text>
        </div>

        <Paper shadow="xs" p="md" radius="md">
          <Group position="apart">
            <Group>
              <TextInput
                placeholder="Search campaigns..."
                style={{ width: 300 }}
              />
              <Select
                placeholder="Category"
                data={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'water', label: 'Water' },
                  { value: 'education', label: 'Education' },
                  { value: 'healthcare', label: 'Healthcare' },
                ]}
                style={{ width: 200 }}
              />
            </Group>
            <Button variant="light">
              Filter
            </Button>
          </Group>
        </Paper>

        <Grid>
          {donations.map((donation) => (
            <Grid.Col key={donation.id} span={4}>
              <DonationCard {...donation} />
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
};

export default DonationsPage;