/*
* Author: BankkRoll
* Date: 10/9/2023
*/
import React from 'react';
import { Navbar, Footer, Banner } from '../layout';
import { SlotMachine } from '../components/slot';
import { useState, useEffect } from 'react';

function Page() {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Handle window resize
    function updateWidth() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateWidth);
    updateWidth();
  
    // Cleanup
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <main>
      <Navbar />
      <div className={`home-block min-h-screen ${windowWidth <= 1200 ? 'slot-block' : ''}`} >
        <SlotMachine />
      </div>
      <Footer />
    </main>
  );
}

export default Page;
