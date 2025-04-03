
export interface User {
  id: string;
  username: string;
  displayName: string;
  profilePicture: string;
  isFollowing: boolean;
}

export interface Photo {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  profilePicture: string;
  mainImage: string;
  selfieImage: string;
  timestamp: string;
  isLate: boolean;
  location?: string;
}

export interface PromptStatus {
  isActive: boolean;
  promptTime: string;
  windowEnd: string;
  remainingTime: number; // in seconds
}
