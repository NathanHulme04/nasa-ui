import React, { useEffect, useState } from 'react';
import './App.css';
import Banner from './Componenets/Banner/Banner';
import ApodCardSection from './Componenets/ApodCard/ApodCardSection';

import { nasaApod } from '../types';
import staticData from './Data/response-16-06-95-02-05-26.json';


function App() {

  return (
    <div className="App">
      <ApodCardSection />
    </div>
    
  );
}

export default App;
