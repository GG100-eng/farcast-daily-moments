
import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Button } from "@/components/ui/button";
import { PromptStatus as PromptStatusType } from '@/types';
import { Helmet } from 'react-helmet-async';

// Function to get full URL with hostname
const getFullUrl = (path: string): string => {
  // For local development and testing
  if (window.location.hostname === 'localhost') {
    return `${window.location.protocol}//${window.location.host}${path}`;
  }
  
  // For production - use a hardcoded domain if available, or fallback to window.location
  // Change this to your actual production domain when deployed
  return `https://${window.location.hostname}${path}`;
};

const FrameView = () => {
  const [promptStatus, setPromptStatus] = useState<PromptStatusType | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await api.getPromptStatus();
        setPromptStatus(status);
      } catch (error) {
        console.error("Failed to fetch prompt status:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatus();
    
    // Log some debugging info about the environment
    console.log("Current hostname:", window.location.hostname);
    console.log("Current origin:", window.location.origin);
    console.log("Current URL:", window.location.href);
  }, []);

  // Frame image is dynamic based on prompt status
  const frameImage = promptStatus?.isActive 
    ? getFullUrl('/active-prompt.png') 
    : getFullUrl('/inactive-prompt.png');
    
  // For testing/debugging
  console.log("Frame image URL:", frameImage);

  return (
    <>
      <Helmet prioritizeSeoTags>
        {/* Frame tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={frameImage} />
        <meta property="fc:frame:button:1" content="Capture Moment" />
        <meta property="fc:frame:button:1:action" content="post_redirect" />
        <meta property="fc:frame:button:1:target" content={getFullUrl('/camera')} />
        <meta property="fc:frame:button:2" content="View Timeline" />
        <meta property="fc:frame:button:2:action" content="post_redirect" />
        <meta property="fc:frame:button:2:target" content={getFullUrl('/')} />
        
        {/* These tags help with debugging and preview */}
        <meta property="og:title" content="FarReal Frame" />
        <meta property="og:description" content="A BeReal-like experience for Farcaster" />
        <meta property="og:image" content={frameImage} />
      </Helmet>
      
      {/* UI elements similar to before */}
      <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto">
        <h1 className="text-3xl font-bold farreal-gradient bg-clip-text text-transparent mb-2">
          FarReal Frame
        </h1>
        <p className="text-center mb-6">Frame URL: {window.location.href}</p>
        
        {loading ? (
          <p className="animate-pulse">Loading prompt status...</p>
        ) : (
          <div className="text-center w-full p-4 bg-gray-100 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">Frame Testing Mode</h2>
            <p>Image URL: {frameImage}</p>
            <p>Status: {promptStatus?.isActive ? 'Active' : 'Inactive'}</p>
            
            <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
              <p>When viewed in Warpcast, this page should appear as a Frame.</p>
              <p>Try pasting the URL in a Warpcast message.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FrameView;
