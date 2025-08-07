import React, { useState } from 'react';
import {
  IconHome,
  IconHeart,
  IconCalendarEvent,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconHelp,
  IconLogout,
  IconUser
} from '@tabler/icons-react';
import { Group, Title } from '@mantine/core';
import classes from './NavbarSimpleColored.module.css';

const data = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/donations', label: 'Donations', icon: IconHeart },
  { link: '/events', label: 'Events', icon: IconCalendarEvent },
  { link: '/volunteers', label: 'Volunteers', icon: IconUsers },
  { link: '/analytics', label: 'Analytics', icon: IconChartBar },
  { link: '/settings', label: 'Settings', icon: IconSettings },
  { link: '/help', label: 'Help & Support', icon: IconHelp },
];

export function NavbarSimpleColored() {
  const [active, setActive] = useState('Home');

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Title order={3} style={{ color: 'white' }}>HH Donations</Title>
          <IconHeart size={28} style={{ color: 'white' }} />
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a href="/profile" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconUser className={classes.linkIcon} stroke={1.5} />
          <span>User Profile</span>
        </a>

        <a href="/logout" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}