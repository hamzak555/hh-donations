import React from 'react';
import { 
  Container, 
  Group, 
  Text, 
  Stack, 
  SimpleGrid,
  Anchor,
  Divider,
  Box
} from '@mantine/core';
import { 
  IconMail, 
  IconPhone, 
  IconMapPin,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconHeart
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import classes from './Footer.module.css';
import hhLogoGreen from '../assets/HH Logo Green.png';

const Footer = () => {
  const quickLinks = [
    { label: 'Home', link: '/' },
    { label: 'Donations', link: '/donations' },
    { label: 'Events', link: '/events' },
    { label: 'Volunteers', link: '/volunteers' },
  ];

  const supportLinks = [
    { label: 'FAQ', link: '/faq' },
    { label: 'Help & Support', link: '/help' },
    { label: 'Contact Us', link: '/contact' },
    { label: 'Privacy Policy', link: '/privacy' },
  ];

  return (
    <footer className={classes.footer}>
      <Container size="xl">
        <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'md', cols: 2 }, { maxWidth: 'sm', cols: 1 }]} spacing="xl">
          {/* Logo and Description */}
          <Stack spacing="md" align="flex-start">
            <img 
              src={hhLogoGreen} 
              alt="HH Donations" 
              className={classes.logo}
            />
            <Text size="sm" style={{ color: 'black', lineHeight: 1.6, opacity: 0.8 }}>
              Transforming lives through clothing donations. Together, we provide dignity, warmth, and hope to families in need across our community.
            </Text>
            <Group spacing="md">
              <IconBrandFacebook size={20} className={classes.socialIcon} />
              <IconBrandTwitter size={20} className={classes.socialIcon} />
              <IconBrandInstagram size={20} className={classes.socialIcon} />
            </Group>
          </Stack>

          {/* Quick Links */}
          <Stack spacing="md">
            <Text weight={600} size="sm" style={{ color: 'black' }}>
              Quick Links
            </Text>
            <Stack spacing="xs">
              {quickLinks.map((item, index) => (
                <Anchor
                  key={index}
                  component={Link}
                  to={item.link}
                  size="sm"
                  className={classes.link}
                >
                  {item.label}
                </Anchor>
              ))}
            </Stack>
          </Stack>

          {/* Support */}
          <Stack spacing="md">
            <Text weight={600} size="sm" style={{ color: 'black' }}>
              Support
            </Text>
            <Stack spacing="xs">
              {supportLinks.map((item, index) => (
                <Anchor
                  key={index}
                  component={Link}
                  to={item.link}
                  size="sm"
                  className={classes.link}
                >
                  {item.label}
                </Anchor>
              ))}
            </Stack>
          </Stack>

          {/* Contact Info */}
          <Stack spacing="md">
            <Text weight={600} size="sm" style={{ color: 'black' }}>
              Get In Touch
            </Text>
            <Stack spacing="sm">
              <Group spacing="sm">
                <IconMapPin size={16} style={{ color: 'var(--hh-primary)' }} />
                <Text size="sm" style={{ color: 'black', opacity: 0.8 }}>
                  123 Donation St, City, State 12345
                </Text>
              </Group>
              <Group spacing="sm">
                <IconPhone size={16} style={{ color: 'var(--hh-primary)' }} />
                <Text size="sm" style={{ color: 'black', opacity: 0.8 }}>
                  (555) 123-4567
                </Text>
              </Group>
              <Group spacing="sm">
                <IconMail size={16} style={{ color: 'var(--hh-primary)' }} />
                <Text size="sm" style={{ color: 'black', opacity: 0.8 }}>
                  info@hhdonations.org
                </Text>
              </Group>
            </Stack>
          </Stack>
        </SimpleGrid>

        <Divider my="xl" color="rgba(9, 76, 59, 0.2)" />
        
        {/* Bottom Section */}
        <Group position="apart" align="center">
          <Text size="sm" style={{ color: 'black', opacity: 0.7 }}>
            © 2025 HH Donations. All rights reserved.
          </Text>
          <Group spacing="4px" align="center">
            <Text size="sm" style={{ color: 'black', opacity: 0.7 }}>
              Made with
            </Text>
            <IconHeart size={16} style={{ color: 'var(--hh-primary)' }} />
            <Text size="sm" style={{ color: 'black', opacity: 0.7 }}>
              for our community
            </Text>
          </Group>
        </Group>
      </Container>
    </footer>
  );
};

export default Footer;