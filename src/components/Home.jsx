import React from 'react';
import { useNavigate } from 'react-router-dom'; // If using React Router

function Home() {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/hero'); // route to your hero/game page
  };

  const handleFollowClick = () => {
    // Open your social media page in a new tab
    window.open('https://instagram.com/yourprofile', '_blank');
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f7f7f7',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#4B0082' }}>Wordle Darija</h1>
      
      <button
        onClick={handlePlayClick}
        style={{
          padding: '15px 30px',
          fontSize: '1.2rem',
          marginBottom: '20px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: '#6B46C1',
          color: 'white',
          boxShadow: '0 4px 6px rgba(107, 70, 193, 0.5)'
        }}
      >
        Play
      </button>

      <button
        onClick={handleFollowClick}
        style={{
          padding: '12px 25px',
          fontSize: '1rem',
          borderRadius: '8px',
          border: '2px solid #6B46C1',
          backgroundColor: 'white',
          cursor: 'pointer',
          color: '#6B46C1',
          fontWeight: 'bold'
        }}
      >
        Follow Us on Social Media
      </button>
    </div>
  );
}

export default Home;
