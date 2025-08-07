import React, { useState } from 'react';
import {
  IconHome,
  IconHeart,
  IconCalendarEvent,
  IconUsers,
  IconChartBar,
  IconHelp,
  IconQuestionMark
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import classes from './NavbarSimpleColored.module.css';
import hhLogoWhite from '../assets/hh-logo-white.png';

const data = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/donations', label: 'Donations', icon: IconHeart },
  { link: '/events', label: 'Events', icon: IconCalendarEvent },
  { link: '/volunteers', label: 'Volunteers', icon: IconUsers },
  { link: '/analytics', label: 'Analytics', icon: IconChartBar },
  { link: '/help', label: 'Help & Support', icon: IconHelp },
  { link: '/faq', label: 'FAQ', icon: IconQuestionMark },
];

export function NavbarSimpleColored() {
  const [active, setActive] = useState('Home');

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <div className={classes.header}>
          <img 
            src={hhLogoWhite} 
            alt="HH Donations" 
            className={classes.logo}
          />
        </div>
        {links}
      </div>
    </nav>
  );
}