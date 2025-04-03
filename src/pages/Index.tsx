
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Camera from '@/components/Camera';
import PhotoCard from '@/components/PhotoCard';
import PromptStatus from '@/components/PromptStatus';
import { api } from '@/services/api';
import { Photo, PromptStatus as PromptStatusType } from '@/types';
import { useMiniKit } from '@/context/MiniKitContext';

const Index = () => {
  const { toast } = useToast();
  const { addFrame } = useMiniKit();
  
  const [promptStatus, setPromptStatus] = useState<PromptStatusType | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const [showCamera, setShowCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [friendsPosts, setFriendsPosts] = useState<Photo[]>([]);
  const [allPosts, setAllPosts] = useState<Photo[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  
  // Farcaster Frame meta tags
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const frameImage = promptStatus?.isActive 
    ? `${baseUrl}/active-prompt.png` 
    : `${baseUrl}/inactive-prompt.png`;
  
  // Fetch prompt status
  useEffect(() => {
    const fetchPromptStatus = async () => {
      try {
        const status = await api.getPromptStatus();
        setPromptStatus(status);
        setIsLoadingStatus(false);
      } catch (error) {
        console.error('Error fetching prompt status:', error);
        toast({
          title: "Error",
          description: "Failed to load prompt status",
          variant: "destructive",
        });
        setIsLoadingStatus(false);
      }
    };
    
    fetchPromptStatus();
    
    // Poll for updates every 10 seconds
    const intervalId = setInterval(fetchPromptStatus, 10000);
    
    return () => clearInterval(intervalId);
  }, [toast]);
  
  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoadingPosts(true);
      try {
        const [friends, all] = await Promise.all([
          api.getFriendsPosts(),
          api.getAllPosts(),
        ]);
        
        setFriendsPosts(friends);
        setAllPosts(all);
        setIsLoadingPosts(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Error",
          description: "Failed to load posts",
          variant: "destructive",
        });
        setIsLoadingPosts(false);
      }
    };
    
    fetchPosts();
  }, [toast]);
  
  // Handle subscription to notifications
  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      // In a real app, this would register with MiniKit's notification system
      await api.subscribeToNotifications();
      const result = await addFrame();
      
      if (result) {
        toast({
          title: "Success!",
          description: "You're now subscribed to daily FarReal notifications",
        });
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe to notifications",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };
  
  // Toggle prompt (for hackathon demo only)
  const handleTogglePrompt = async () => {
    try {
      const status = await api.togglePrompt();
      setPromptStatus(status);
      
      if (status.isActive) {
        toast({
          title: "Prompt Activated!",
          description: "You have 10 minutes to post your moment",
        });
      } else {
        toast({
          title: "Prompt Ended",
          description: "Today's prompt window has closed",
        });
      }
    } catch (error) {
      console.error('Error toggling prompt:', error);
    }
  };
  
  // Handle photo capture and submission
  const handlePhotoCapture = async (mainImage: string, selfieImage: string) => {
    setIsSubmitting(true);
    try {
      const photo = await api.submitPhoto(mainImage, selfieImage);
      
      // Add the new photo to both lists
      setFriendsPosts([photo, ...friendsPosts]);
      setAllPosts([photo, ...allPosts]);
      
      setShowCamera(false);
      
      toast({
        title: "Success!",
        description: "Your moment has been shared",
      });
    } catch (error) {
      console.error('Error submitting photo:', error);
      toast({
        title: "Error",
        description: "Failed to submit your moment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto p-4">
      {/* Farcaster Frame meta tags */}
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={frameImage} />
        <meta property="fc:frame:button:1" content="Take FarReal" />
        <meta property="fc:frame:button:1:action" content="post_redirect" />
        <meta property="fc:frame:button:1:target" content={`${baseUrl}/camera`} />
        <meta property="fc:frame:button:2" content="View Timeline" />
        <meta property="fc:frame:button:2:action" content="post_redirect" />
        <meta property="fc:frame:button:2:target" content={`${baseUrl}/timeline`} />
      </head>

      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold farreal-gradient bg-clip-text text-transparent">
          FarReal
        </h1>
        <p className="text-muted-foreground">Share your daily moments on Farcaster</p>
      </header>
      
      <PromptStatus 
        status={promptStatus}
        isLoading={isLoadingStatus}
        onSubscribe={handleSubscribe}
        isSubscribing={isSubscribing}
        onTogglePrompt={handleTogglePrompt} // For hackathon demo only
      />
      
      {!showCamera ? (
        <div className="mb-6">
          <Button 
            onClick={() => setShowCamera(true)}
            className="w-full farreal-gradient text-white"
            size="lg"
          >
            {promptStatus?.isActive 
              ? "Capture Your FarReal Moment" 
              : "Post a Late FarReal"}
          </Button>
        </div>
      ) : (
        <div className="mb-6">
          <Camera 
            onCapture={handlePhotoCapture} 
            isSubmitting={isSubmitting} 
          />
          <Button 
            onClick={() => setShowCamera(false)}
            variant="outline"
            className="w-full mt-4"
          >
            Cancel
          </Button>
        </div>
      )}
      
      <Tabs defaultValue="friends">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="friends" className="flex-1">Friends</TabsTrigger>
          <TabsTrigger value="all" className="flex-1">Everyone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="friends">
          {isLoadingPosts ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground animate-pulse">Loading friends' posts...</p>
            </div>
          ) : friendsPosts.length > 0 ? (
            friendsPosts.map(photo => (
              <PhotoCard key={photo.id} photo={photo} />
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No posts from friends yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your friends' posts will appear here once they share their moments
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all">
          {isLoadingPosts ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground animate-pulse">Loading all posts...</p>
            </div>
          ) : allPosts.length > 0 ? (
            allPosts.map(photo => (
              <PhotoCard key={photo.id} photo={photo} />
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No posts yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Be the first to share your FarReal moment!
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
