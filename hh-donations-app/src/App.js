import React from 'react';
import '@mantine/core/styles.css';
import './styles/App.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { NavbarSimpleColored } from './components/NavbarSimpleColored';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import WhatToDonate from './pages/WhatToDonate';
import FindBin from './pages/FindBin';
import About from './pages/About';
import { FaqPage } from './pages/FaqPage';
import ClickableDashboard from './pages/ClickableDashboard';
import ComponentDemo from './pages/ComponentDemo';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="App">
      <NavbarSimpleColored />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/what-to-donate" element={<WhatToDonate />} />
          <Route path="/find-bin" element={<FindBin />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/admin" element={<ClickableDashboard />} />
          <Route path="/components" element={<ComponentDemo />} />
        </Routes>
        {!isAdminPage && <Footer />}
      </main>
    </div>
  );
}

function App() {
  return (
    <MantineProvider>
      <Router>
        <AppContent />
      </Router>
    </MantineProvider>
  );
}

export default App;
