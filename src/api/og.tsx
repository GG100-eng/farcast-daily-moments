
import React from 'react';
import { api } from '@/services/api';

// This would typically be a server-side API endpoint
// For the hackathon, we're mocking this with a client-side component
export default async function OGImage() {
  const status = await api.getPromptStatus();
  
  // This is just a mock - in a real implementation this would generate
  // an actual image on the server
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1200px',
      height: '630px',
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: 'sans-serif',
      padding: '40px'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>FarReal</h1>
      <p style={{ fontSize: '24px', marginBottom: '30px' }}>Share your daily moments on Farcaster</p>
      
      {status.isActive ? (
        <div>
          <h2 style={{ fontSize: '36px', marginBottom: '10px' }}>It's FarReal Time!</h2>
          <p style={{ fontSize: '24px' }}>
            You have {Math.floor(status.remainingTime / 60)}:{String(status.remainingTime % 60).padStart(2, '0')} minutes to capture your moment
          </p>
        </div>
      ) : (
        <div>
          <h2 style={{ fontSize: '36px', marginBottom: '10px' }}>No Active Prompt</h2>
          <p style={{ fontSize: '24px' }}>The next FarReal moment hasn't been triggered yet.</p>
        </div>
      )}
    </div>
  );
}
