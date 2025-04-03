
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Photo } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface PhotoCardProps {
  photo: Photo;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  const timeAgo = formatDistanceToNow(new Date(photo.timestamp), { addSuffix: true });
  
  return (
    <Card className="w-full mb-6 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={photo.profilePicture} alt={photo.displayName} />
            <AvatarFallback>{photo.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{photo.displayName}</div>
            <div className="text-xs text-muted-foreground">@{photo.username}</div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            {photo.isLate && (
              <Badge variant="outline" className="text-farreal-red border-farreal-red">
                Late
              </Badge>
            )}
            <div className="text-xs text-muted-foreground">{timeAgo}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-1">
        <div className="relative">
          <img src={photo.mainImage} alt="Daily moment" className="w-full rounded-sm" />
          <div className="absolute bottom-2 right-2 w-24 h-24 rounded-md overflow-hidden border-2 border-white shadow-md">
            <img src={photo.selfieImage} alt="Selfie" className="w-full h-full object-cover" />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground pt-1 pb-3">
        {photo.location && (
          <div>📍 {photo.location}</div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PhotoCard;
