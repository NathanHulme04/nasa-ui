import React, { useEffect, useState } from 'react';
import './App.css';
import Banner from './Componenets/Banner/Banner';
import ApodCardSection from './Componenets/ApodCard/ApodCardSection';

import { nasaApod } from '../types';
import staticData from './Data/response-16-06-95-02-05-26.json';

//TO DO: Rename
const typedStaticData = staticData as nasaApod[];

function App() {

  // TO DO:
  /*
    Implement search functionality to allow users to search for APODs by date, title, or keywords.
    Implement pagination to allow users to navigate through the APOD collection more easily.
    Implement lazy loading for images to improve performance and reduce initial load time.
    Implement error handling to display user-friendly messages when API requests fail or return no results.
    Implement the ability to save favorite APODs to a user's profile or local storage for easy access later.
    Implement the ability to see more and expand on the APOD details, such as the explanation, copyright information, and media type.
  */

  
//   useEffect(() => {
//     async function fetchNasaAPOD(): Promise<nasaApod[] | null> {
//         const response = await fetch('http://localhost:8080/nasaApplication/apod/search?fromDate=2026-01-01&toDate=2026-04-25&sortBy=date&sortOrder=desc');
//         if (!response.ok) {
//             console.error('Failed to fetch NASA APOD data');
//             return null;
//         }
//         console.log('Response:', response);
//         const data = await response.json();
//         setApod(data);
//         return data;
//     }
//     const RenderNasaApod = () => {
//         fetchNasaAPOD();
//     }
//     RenderNasaApod();
// }, []);

  return (
    <div className="App" style={{ maxWidth: '85vw', margin: '0 auto', padding: '16px' }}>
      <section className='intro-section'>
        <h1>Welcome to the NASA APOD Gallery</h1>
        <p>Explore the wonders of the universe with our NASA Astronomy Picture of the Day (APOD) gallery. Each day, we bring you a new image or video from NASA's APOD API, showcasing the beauty and mystery of space. From stunning nebulae to breathtaking galaxies, our gallery is your gateway to the cosmos. Dive into the explanations and discover the science behind each celestial masterpiece. Join us on this cosmic journey and experience the awe-inspiring wonders of our universe.</p>
        <p>Here you can search through the APOD collection by date, title, or keywords to find your favorite space imagery.</p>
        <p><i><b>This collection of images is relevant as of date: {new Date(typedStaticData[0]?.date).toLocaleDateString()}</b></i></p>
      </section>
      {/* <Banner nasaApod={apod ? apod[0] : null} /> */}
      <ApodCardSection />
    </div>
    
  );
}

export default App;
