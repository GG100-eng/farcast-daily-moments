
import React from 'react';
import Camera from '@/components/Camera';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/services/api';
import { Button } from "@/components/ui/button";

const CameraPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fid = searchParams.get('fid');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handlePhotoCapture = async (mainImage: string, selfieImage: string) => {
    setIsSubmitting(true);
    try {
      await api.submitPhoto(mainImage, selfieImage);
      
      toast({
        title: "Success!",
        description: "Your moment has been shared",
      });
      
      // Redirect back to the timeline
      navigate(`/?fid=${fid}`);
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
  
  const handleCancel = () => {
    navigate(`/?fid=${fid}`);
  };
  
  return (
    <div className="container max-w-md mx-auto p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold farreal-gradient bg-clip-text text-transparent">
          Capture Your Moment
        </h1>
        <p className="text-muted-foreground">Take a photo of what you're doing right now</p>
      </header>
      
      <Camera onCapture={handlePhotoCapture} isSubmitting={isSubmitting} />
      
      <Button 
        onClick={handleCancel}
        variant="outline"
        className="w-full mt-4"
      >
        Cancel
      </Button>
    </div>
  );
};

export default CameraPage;
