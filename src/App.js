import React from 'react';
import '@mantine/core/styles.css';
import './styles/App.css';
import { MantineProvider } from '@mantine/core';
import { NavbarSimpleColored } from './components/NavbarSimpleColored';
import Homepage from './pages/Homepage';

function App() {
  return (
    <MantineProvider>
      <div className="App">
        <div style={{ display: 'flex' }}>
          <NavbarSimpleColored />
          <main style={{ flex: 1, backgroundColor: 'var(--hh-light)', minHeight: '100vh' }}>
            <Homepage />
          </main>
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;
