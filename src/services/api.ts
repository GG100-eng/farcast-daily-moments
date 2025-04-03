
import { Photo, PromptStatus, User } from '../types';

// Mock data for the app
const mockUsers: User[] = [
  {
    id: '1',
    username: 'sarah',
    displayName: 'Sarah Chen',
    profilePicture: 'https://api.dicebear.com/7.x/personas/svg?seed=sarah',
    isFollowing: true,
  },
  {
    id: '2',
    username: 'alex',
    displayName: 'Alex Johnson',
    profilePicture: 'https://api.dicebear.com/7.x/personas/svg?seed=alex',
    isFollowing: true,
  },
  {
    id: '3',
    username: 'miguel',
    displayName: 'Miguel Rodriguez',
    profilePicture: 'https://api.dicebear.com/7.x/personas/svg?seed=miguel',
    isFollowing: true,
  },
  {
    id: '4',
    username: 'jordan',
    displayName: 'Jordan Taylor',
    profilePicture: 'https://api.dicebear.com/7.x/personas/svg?seed=jordan',
    isFollowing: false,
  },
  {
    id: '5',
    username: 'priya',
    displayName: 'Priya Patel',
    profilePicture: 'https://api.dicebear.com/7.x/personas/svg?seed=priya',
    isFollowing: false,
  },
];

const mockPhotos: Photo[] = [
  {
    id: '1',
    userId: '1',
    username: 'sarah',
    displayName: 'Sarah Chen',
    profilePicture: 'https://api.dicebear.com/7.x/personas/svg?seed=sarah',
    mainImage: 'https://source.unsplash.com/random/800x600?coffee',
    selfieImage: 'https://api.dicebear.com/7.x/personas/svg?seed=sarah&scale=110',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    isLate: false,
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    userId: '2',
    username: 'alex',
    displayName: 'Alex Johnson',
    profilePicture: 'https://api.dicebear.com/7.x/personas/svg?seed=alex',
    mainImage: 'https://source.unsplash.com/random/800x600?laptop',
    selfieImage: 'https://api.dicebear.com/7.x/personas/svg?seed=alex&scale=110',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    isLate: false,
  },
  {
    id: '3',
    userId: '3',
    username: 'miguel',
    displayName: 'Miguel Rodriguez',
    profilePicture: 'https://api.dicebear.com/7.x/personas/svg?seed=miguel',
    mainImage: 'https://source.unsplash.com/random/800x600?beach',
    selfieImage: 'https://api.dicebear.com/7.x/personas/svg?seed=miguel&scale=110',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isLate: true,
  },
  {
    id: '4',
    userId: '4',
    username: 'jordan',
    displayName: 'Jordan Taylor',
    profilePicture: 'https://api.dicebear.com/7.x/personas/svg?seed=jordan',
    mainImage: 'https://source.unsplash.com/random/800x600?city',
    selfieImage: 'https://api.dicebear.com/7.x/personas/svg?seed=jordan&scale=110',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isLate: false,
    location: 'New York, NY',
  },
  {
    id: '5',
    userId: '5',
    username: 'priya',
    displayName: 'Priya Patel',
    profilePicture: 'https://api.dicebear.com/7.x/personas/svg?seed=priya',
    mainImage: 'https://source.unsplash.com/random/800x600?food',
    selfieImage: 'https://api.dicebear.com/7.x/personas/svg?seed=priya&scale=110',
    timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    isLate: true,
  },
];

// For hackathon purposes, we'll simulate the prompt status
let mockPromptStatus: PromptStatus = {
  isActive: false,
  promptTime: new Date().toISOString(),
  windowEnd: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes from now
  remainingTime: 600, // 10 minutes in seconds
};

// Simulate a random time for the prompt
const resetPromptTime = () => {
  const now = new Date();
  const promptTime = new Date();
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  promptTime.setHours(hour, minute, 0, 0);
  
  const windowEnd = new Date(promptTime.getTime() + 10 * 60 * 1000); // 10 minutes after prompt time
  
  // If the prompt time is in the past for today, it's already happened
  const isActive = now >= promptTime && now <= windowEnd;
  
  let remainingTime = 0;
  if (isActive) {
    remainingTime = Math.floor((windowEnd.getTime() - now.getTime()) / 1000);
  }
  
  mockPromptStatus = {
    isActive,
    promptTime: promptTime.toISOString(),
    windowEnd: windowEnd.toISOString(),
    remainingTime,
  };
};

// Initialize prompt time
resetPromptTime();

// For the hackathon implementation, we'll simulate these API calls
export const api = {
  getPromptStatus: (): Promise<PromptStatus> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update the remaining time
        if (mockPromptStatus.isActive) {
          const now = new Date();
          const windowEnd = new Date(mockPromptStatus.windowEnd);
          mockPromptStatus.remainingTime = Math.max(0, Math.floor((windowEnd.getTime() - now.getTime()) / 1000));
          
          // If time is up, set isActive to false
          if (mockPromptStatus.remainingTime <= 0) {
            mockPromptStatus.isActive = false;
          }
        }
        resolve(mockPromptStatus);
      }, 300);
    });
  },
  
  // For the hackathon, it's easier to simulate prompt toggling
  togglePrompt: (): Promise<PromptStatus> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!mockPromptStatus.isActive) {
          // Start a new prompt
          const now = new Date();
          const windowEnd = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
          
          mockPromptStatus = {
            isActive: true,
            promptTime: now.toISOString(),
            windowEnd: windowEnd.toISOString(),
            remainingTime: 600, // 10 minutes in seconds
          };
        } else {
          // End the current prompt
          mockPromptStatus.isActive = false;
          mockPromptStatus.remainingTime = 0;
        }
        resolve(mockPromptStatus);
      }, 300);
    });
  },
  
  getFriendsPosts: (): Promise<Photo[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter to only include posts from users the current user is following
        const followingIds = mockUsers.filter(user => user.isFollowing).map(user => user.id);
        const friendsPosts = mockPhotos.filter(photo => followingIds.includes(photo.userId));
        resolve(friendsPosts);
      }, 500);
    });
  },
  
  getAllPosts: (): Promise<Photo[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPhotos);
      }, 500);
    });
  },
  
  submitPhoto: (mainImage: string, selfieImage: string): Promise<Photo> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a new photo object
        const now = new Date();
        const isLate = !mockPromptStatus.isActive;
        const newPhoto: Photo = {
          id: Date.now().toString(),
          userId: 'current-user', // In a real app, this would be the authenticated user's ID
          username: 'you',
          displayName: 'You',
          profilePicture: 'https://api.dicebear.com/7.x/personas/svg?seed=you',
          mainImage,
          selfieImage,
          timestamp: now.toISOString(),
          isLate,
        };
        
        // In a real app, we would save this to the backend
        // For the hackathon, we'll just add it to our mock data
        mockPhotos.unshift(newPhoto);
        
        resolve(newPhoto);
      }, 800);
    });
  },
  
  subscribeToNotifications: (): Promise<{ success: boolean, message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful subscription
        resolve({ success: true, message: "You're now subscribed to daily notifications!" });
      }, 600);
    });
  }
};
