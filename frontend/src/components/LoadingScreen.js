import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoadingScreen.css';

const LoadingScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the 'hasLoadedOnce' flag is set in session storage
    if (sessionStorage.getItem('hasLoadedOnce')) {
      navigate('/login');
    } else {
      // Set the flag in session storage after displaying the loading screen
      sessionStorage.setItem('hasLoadedOnce', 'true');

      // Navigate to login after the animation
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2800); // Adjust time as necessary for your animation

      return () => clearTimeout(timer);
    }
  }, [navigate]);

  


  return (
    <div className="loading-page">
      <div className="logo-container">
        <img src="/logo.png" alt="Logo" className="logo" /> {/* Update path to your logo */}
        <h1 className="slogan">Discover the World of books</h1> {/* Update slogan as needed */}
      </div>
    </div>
  );
};

export default LoadingScreen;