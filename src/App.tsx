import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Banner from './Componenets/Banner/Banner';

import { NasaApod } from '../types';

function App() {

  const [apod, setApod] = useState<NasaApod | null>(null);
  useEffect(() => {
    async function fetchNasaAPOD(): Promise<NasaApod | null> {
        const response = await fetch('http://localhost:8080/nasaApplication/apod');
        if (!response.ok) {
            console.error('Failed to fetch NASA APOD data');
            return null;
        }
        console.log('Response:', response);
        const data = await response.json();
        setApod(data);
        return data;
    }
    fetchNasaAPOD();
}, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Banner NasaApod={apod} />
    </div>
    
  );
}

export default App;
