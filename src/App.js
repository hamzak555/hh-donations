import React from 'react';
import '@mantine/core/styles.css';
import './styles/App.css';
import { MantineProvider } from '@mantine/core';
import DonationsPage from './pages/DonationsPage';

function App() {
  return (
    <MantineProvider>
      <div className="App">
        <DonationsPage />
      </div>
    </MantineProvider>
  );
}

export default App;
