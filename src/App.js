import React from 'react';
import '@mantine/core/styles.css';
import './styles/App.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavbarSimpleColored } from './components/NavbarSimpleColored';
import Homepage from './pages/Homepage';
import { FaqPage } from './pages/FaqPage';

function App() {
  return (
    <MantineProvider>
      <Router>
        <div className="App">
          <div style={{ display: 'flex' }}>
            <NavbarSimpleColored />
            <main style={{ flex: 1, backgroundColor: 'white', minHeight: '100vh' }}>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/faq" element={<FaqPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </MantineProvider>
  );
}

export default App;
