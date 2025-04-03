
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, RefreshCw } from "lucide-react";

interface CameraProps {
  onCapture: (mainImage: string, selfieImage: string) => void;
  isSubmitting: boolean;
}

const CameraComponent: React.FC<CameraProps> = ({ onCapture, isSubmitting }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize camera
  useEffect(() => {
    if (isCameraActive && videoRef.current) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: isFrontCamera ? 'user' : 'environment',
            },
            audio: false,
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error('Error accessing camera:', err);
        }
      };
      
      startCamera();
      
      // Cleanup function
      return () => {
        const stream = videoRef.current?.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isCameraActive, isFrontCamera]);
  
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        
        if (!mainImage) {
          // First photo is the main photo
          setMainImage(imageDataUrl);
          // Switch to front camera for selfie
          setIsFrontCamera(true);
        } else {
          // Second photo is the selfie
          setSelfieImage(imageDataUrl);
          // Stop the camera
          const stream = video.srcObject as MediaStream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          setIsCameraActive(false);
        }
      }
    }
  };
  
  const resetCapture = () => {
    setMainImage(null);
    setSelfieImage(null);
    setIsFrontCamera(false);
    setIsCameraActive(true);
  };
  
  const handleSubmit = () => {
    if (mainImage && selfieImage) {
      onCapture(mainImage, selfieImage);
    }
  };
  
  return (
    <Card className="w-full overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Capture Your Moment</h2>
        <p className="text-sm text-gray-500 mb-4">
          {!mainImage 
            ? "Take a photo of what you're doing" 
            : !selfieImage 
              ? "Now take a selfie" 
              : "Ready to submit!"}
        </p>
      </div>
      
      <div className="relative w-full h-64 md:h-96">
        {isCameraActive ? (
          <div className="camera-container">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-4">
              <Button 
                onClick={takePhoto}
                size="lg" 
                className="rounded-full w-16 h-16 p-0"
              >
                <Camera className="h-8 w-8" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 h-full">
            {mainImage && (
              <div className="relative">
                <img 
                  src={mainImage} 
                  alt="Main capture" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                    Main
                  </span>
                </div>
              </div>
            )}
            
            {selfieImage && (
              <div className="relative">
                <img 
                  src={selfieImage} 
                  alt="Selfie" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                    Selfie
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-muted/20">
        {!isCameraActive && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={resetCapture}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retake
            </Button>
            
            <Button 
              onClick={handleSubmit}
              disabled={!mainImage || !selfieImage || isSubmitting}
              className="flex-1 farreal-gradient text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        )}
        
        {!isCameraActive && !mainImage && (
          <Button 
            onClick={() => setIsCameraActive(true)} 
            className="w-full farreal-gradient text-white"
          >
            Start Camera
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CameraComponent;
