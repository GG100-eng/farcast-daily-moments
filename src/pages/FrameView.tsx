
import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Button } from "@/components/ui/button";
import { PromptStatus as PromptStatusType } from '@/types';

const FrameView = () => {
  const [promptStatus, setPromptStatus] = useState<PromptStatusType | null>(null);
  const [loading, setLoading] = useState(true);
  
  // The base URL for production
  const baseUrl = window.location.origin;
  
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
  }, []);

  // Frame image is dynamic based on prompt status
  const frameImage = promptStatus?.isActive 
    ? `${baseUrl}/active-prompt.png` 
    : `${baseUrl}/inactive-prompt.png`;

  return (
    <>
      {/* Farcaster Frame meta tags */}
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={frameImage} />
        <meta property="fc:frame:button:1" content="Capture Moment" />
        <meta property="fc:frame:button:1:action" content="post_redirect" />
        <meta property="fc:frame:button:1:target" content={`${baseUrl}/camera`} />
        <meta property="fc:frame:button:2" content="View Timeline" />
        <meta property="fc:frame:button:2:action" content="post_redirect" />
        <meta property="fc:frame:button:2:target" content={`${baseUrl}/`} />
      </head>

      <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto">
        <h1 className="text-3xl font-bold farreal-gradient bg-clip-text text-transparent mb-2">
          FarReal
        </h1>
        <p className="text-center mb-6">Share your daily moments on Farcaster</p>
        
        {loading ? (
          <p className="animate-pulse">Loading today's prompt status...</p>
        ) : promptStatus ? (
          <div className="text-center w-full p-4 bg-gray-100 rounded-lg mb-6">
            {promptStatus.isActive ? (
              <>
                <h2 className="text-xl font-semibold mb-2">It's FarReal Time!</h2>
                <p className="mb-2">
                  You have {Math.floor(promptStatus.remainingTime / 60)}:
                  {String(promptStatus.remainingTime % 60).padStart(2, '0')} to capture your moment
                </p>
                <Button className="farreal-gradient text-white mt-2 w-full" size="lg">
                  Capture Your Moment
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-2">No Active Prompt</h2>
                <p>The next FarReal moment hasn't been triggered yet.</p>
                <Button className="mt-2 w-full" variant="outline">
                  Post a Late FarReal
                </Button>
              </>
            )}
          </div>
        ) : (
          <p>Could not load prompt status. Please try again later.</p>
        )}
        
        <div className="flex gap-4 w-full">
          <Button className="flex-1" variant="outline">
            View Timeline
          </Button>
        </div>
        
        <div className="mt-6 text-sm text-center text-gray-500">
          <p>This is a Farcaster Frame implementation of FarReal.</p>
          <p>In Warpcast, you would be able to interact with the buttons above.</p>
        </div>
      </div>
    </>
  );
};

export default FrameView;
