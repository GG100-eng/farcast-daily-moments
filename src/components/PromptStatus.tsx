
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { PromptStatus } from '@/types';

interface PromptStatusProps {
  status: PromptStatus | null;
  isLoading: boolean;
  onSubscribe: () => void;
  isSubscribing: boolean;
  onTogglePrompt?: () => void; // For hackathon demo only
}

const PromptStatusComponent: React.FC<PromptStatusProps> = ({ 
  status, 
  isLoading, 
  onSubscribe, 
  isSubscribing, 
  onTogglePrompt
}) => {
  if (isLoading || !status) {
    return (
      <Card className="w-full mb-6">
        <CardContent className="pt-6 pb-6">
          <div className="text-center animate-pulse">
            <p className="text-muted-foreground mb-2">Checking today's prompt status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format the time
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format remaining time
  const formatRemainingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <Card className="w-full mb-6">
      <CardContent className="pt-6 pb-6">
        {status.isActive ? (
          <div>
            <div className="mb-4 text-center">
              <h3 className="text-xl font-bold farreal-gradient bg-clip-text text-transparent animate-pulse-opacity">
                It's FarReal Time!
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                You have {formatRemainingTime(status.remainingTime)} left to post
              </p>
              <Progress value={(status.remainingTime / 600) * 100} className="h-2" />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-1">Today's FarReal Moment</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Next prompt at: {formatTime(status.promptTime)}
            </p>
            
            <Button 
              onClick={onSubscribe} 
              disabled={isSubscribing}
              className="mb-2 farreal-gradient text-white"
            >
              <Bell className="h-4 w-4 mr-2" />
              {isSubscribing ? "Subscribing..." : "Subscribe to Notifications"}
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Get notified when it's time to share your moment!
            </p>
          </div>
        )}
        
        {/* Toggle button - for hackathon demo only */}
        {onTogglePrompt && (
          <div className="mt-4 border-t pt-4">
            <p className="text-xs text-muted-foreground text-center mb-2">
              Demo Control (Hackathon Only)
            </p>
            <Button 
              onClick={onTogglePrompt}
              variant="outline" 
              size="sm"
              className="w-full"
            >
              {status.isActive ? "End Prompt" : "Trigger Prompt Now"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptStatusComponent;
