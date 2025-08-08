import React from 'react';
import { Card, Image, Text, Badge, Button, Group, Stack } from '@mantine/core';

const DonationCard = ({ title, description, goal, raised, image, category }) => {
  const percentage = (raised / goal) * 100;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={image || "https://via.placeholder.com/300x200"}
          height={200}
          alt={title}
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{title}</Text>
        <Badge color="pink" variant="light">
          {category}
        </Badge>
      </Group>

      <Text size="sm" color="dimmed" lineClamp={3}>
        {description}
      </Text>

      <Stack mt="md" spacing="xs">
        <div style={{ width: '100%' }}>
          <Text size="xs" color="dimmed">
            ${raised.toLocaleString()} raised of ${goal.toLocaleString()} goal
          </Text>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            marginTop: '5px'
          }}>
            <div style={{
              width: `${Math.min(percentage, 100)}%`,
              height: '100%',
              backgroundColor: '#228be6',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        <Button fullWidth mt="md" radius="md">
          Donate Now
        </Button>
      </Stack>
    </Card>
  );
};

export default DonationCard;