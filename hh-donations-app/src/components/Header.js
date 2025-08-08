import React from 'react';

const Header = () => {
  return (
    <nav className="header-nav">
      <div className="container">
        <h2>HH Donations</h2>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">Our Story</a></li>
          <li><a href="/donate">Donate</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;