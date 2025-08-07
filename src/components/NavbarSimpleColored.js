import React, { useState } from 'react';
import {
  IconHome,
  IconHeart,
  IconCalendarEvent,
  IconUsers,
  IconChartBar,
  IconHelp
} from '@tabler/icons-react';
import { Image } from '@mantine/core';
import classes from './NavbarSimpleColored.module.css';
import hhLogoWhite from '../assets/hh-logo-white.png';

const data = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/donations', label: 'Donations', icon: IconHeart },
  { link: '/events', label: 'Events', icon: IconCalendarEvent },
  { link: '/volunteers', label: 'Volunteers', icon: IconUsers },
  { link: '/analytics', label: 'Analytics', icon: IconChartBar },
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
        <div className={classes.header}>
          <Image 
            src={hhLogoWhite} 
            alt="HH Donations" 
            height={50}
            fit="contain"
          />
        </div>
        {links}
      </div>
    </nav>
  );
}