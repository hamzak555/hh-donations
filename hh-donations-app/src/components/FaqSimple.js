import { Accordion, Container, Title, Text, Box, Group, Button } from '@mantine/core';
import { IconPlus, IconMinus, IconMail, IconQuestionMark } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const faqs = [
  {
    question: "What types of clothing do you accept?",
    answer: "We accept gently used clothing for all ages including shirts, pants, dresses, shoes, jackets, and accessories. Items should be clean and in good condition. We cannot accept items that are torn, stained, or heavily worn."
  },
  {
    question: "Where do the donated clothes go?",
    answer: "Donated clothing is sorted and distributed directly to families in need across Canada and to under-resourced regions worldwide. We partner with local organizations and maintain full transparency in our distribution process."
  },
  {
    question: "How do I find the nearest donation bin?",
    answer: "Use our interactive map on the 'Find a Bin' page to locate the nearest donation point. Simply enter your address or postal code, and we'll show you all nearby locations with directions and operating hours."
  },
  {
    question: "Are donations tax-deductible?",
    answer: "Yes! H&H Donations is a registered not-for-profit organization. We can provide tax receipts for donations upon request. Contact us with details of your donation for receipt processing."
  },
  {
    question: "Can I volunteer with H&H Donations?",
    answer: "Absolutely! We welcome volunteers to help with sorting, organizing donation drives, and distribution events. Contact us to learn about current volunteer opportunities in your area."
  },
  {
    question: "How can I track the impact of my donation?",
    answer: "We provide regular updates on our social media and website about our global impact. Each donation contributes to our transparent reporting system that shows how many families we've helped."
  },
  {
    question: "Do you accept donations from businesses?",
    answer: "Yes, we work with businesses, schools, and organizations for larger donation drives. We can arrange special pickup services for bulk donations and provide promotional materials for your donation drive."
  },
  {
    question: "What should I do if a donation bin is full?",
    answer: "If a bin is full, please try another nearby location using our map. You can also contact us to report full bins so we can arrange for pickup. Never leave items outside the bins as they may be damaged by weather."
  }
];

export function FaqSimple() {
  const [openItems, setOpenItems] = useState([]);

  return (
    <Box style={{ backgroundColor: '#fafafa', minHeight: '100vh', fontFamily: '"Cal Sans", -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <Container size="md" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <Title
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              color: '#1c1c1c',
              marginBottom: '1rem',
              letterSpacing: '-0.025em'
            }}
          >
            Frequently asked questions
          </Title>
          <Text
            style={{
              fontSize: '1.125rem',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Everything you need to know about donating clothing and our mission to help families worldwide.
          </Text>
        </div>

        {/* FAQ Accordion */}
        <Accordion
          multiple={true}
          value={openItems}
          onChange={setOpenItems}
          styles={{
            root: {
              backgroundColor: 'transparent'
            },
            item: {
              backgroundColor: 'white',
              border: '1px solid #e1e2e3',
              borderRadius: '12px',
              marginBottom: '1rem',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              '&:last-child': {
                marginBottom: 0
              }
            },
            control: {
              backgroundColor: 'white',
              border: 'none',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1c1c1c',
              padding: '1.5rem',
              '&:hover': {
                backgroundColor: '#fafafa'
              }
            },
            panel: {
              backgroundColor: 'white',
              padding: '0 1.5rem 1.5rem 1.5rem'
            },
            content: {
              fontSize: '1rem',
              color: '#4a5568',
              lineHeight: 1.6
            },
            chevron: {
              border: 'none',
              backgroundColor: '#f4f4f4',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#666',
              '&[data-rotate]': {
                transform: 'rotate(180deg)',
              }
            }
          }}
          chevron={
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              backgroundColor: '#f4f4f4',
              borderRadius: '50%',
              color: '#666'
            }}>
              <IconPlus size={16} />
            </div>
          }
        >
          {faqs.map((faq, index) => (
            <Accordion.Item key={index} value={`faq-${index}`}>
              <Accordion.Control>{faq.question}</Accordion.Control>
              <Accordion.Panel>
                <Text>{faq.answer}</Text>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <Box style={{ 
          textAlign: 'center', 
          marginTop: '4rem',
          padding: '3rem 2rem',
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e1e2e3',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'var(--hh-lightest)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <IconQuestionMark size={32} color="var(--hh-primary-darkest)" />
          </div>
          
          <Title
            order={3}
            style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1c1c1c',
              marginBottom: '0.75rem'
            }}
          >
            Still have questions?
          </Title>
          
          <Text
            style={{
              fontSize: '1rem',
              color: '#666',
              marginBottom: '2rem',
              maxWidth: '400px',
              margin: '0 auto 2rem auto',
              lineHeight: 1.5
            }}
          >
            Can't find what you're looking for? Our team is here to help with any questions about donating or our mission.
          </Text>
          
          <Group justify="center" spacing="1rem">
            <Button
              size="lg"
              leftIcon={<IconMail size="1rem" />}
              style={{
                backgroundColor: 'var(--hh-primary-darkest)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 500,
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              Contact Support
            </Button>
            <Button
              component={Link}
              to="/about"
              variant="outline"
              size="lg"
              style={{
                borderColor: '#e1e2e3',
                color: '#666',
                fontSize: '1rem',
                fontWeight: 500,
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: 'white'
              }}
            >
              Learn More
            </Button>
          </Group>
        </Box>
      </Container>
    </Box>
  );
}