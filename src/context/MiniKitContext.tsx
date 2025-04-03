
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MiniKitContextType {
  isFrameReady: boolean;
  setFrameReady: () => void;
  addFrame: () => Promise<{ url: string; token: string } | null>;
  sendNotification: (notification: { title: string; body: string }) => void;
  isAuthenticated: boolean;
  authenticate: () => Promise<boolean>;
}

const MiniKitContext = createContext<MiniKitContextType | undefined>(undefined);

interface MiniKitProviderProps {
  children: ReactNode;
}

export const MiniKitProvider: React.FC<MiniKitProviderProps> = ({ children }) => {
  const [isFrameReady, setIsFrameReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate frame ready status
  const setFrameReady = () => {
    setIsFrameReady(true);
  };

  // Simulate adding a frame
  const addFrame = async (): Promise<{ url: string; token: string } | null> => {
    // In a real implementation, this would integrate with MiniKit
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: 'https://farreal.app/daily',
          token: 'mock-notification-token',
        });
      }, 500);
    });
  };

  // Simulate sending a notification
  const sendNotification = (notification: { title: string; body: string }) => {
    console.log('Notification sent:', notification);
    // In a real app, this would use MiniKit's notification system
  };

  // Simulate authentication
  const authenticate = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsAuthenticated(true);
        resolve(true);
      }, 800);
    });
  };

  return (
    <MiniKitContext.Provider
      value={{
        isFrameReady,
        setFrameReady,
        addFrame,
        sendNotification,
        isAuthenticated,
        authenticate,
      }}
    >
      {children}
    </MiniKitContext.Provider>
  );
};

export const useMiniKit = (): MiniKitContextType => {
  const context = useContext(MiniKitContext);
  if (context === undefined) {
    throw new Error('useMiniKit must be used within a MiniKitProvider');
  }
  return context;
};
