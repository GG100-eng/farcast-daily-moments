
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface FrameRedirectProps {
  targetPath: string;
}

const FrameRedirect: React.FC<FrameRedirectProps> = ({ targetPath }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fid = searchParams.get('fid');
  
  useEffect(() => {
    // Redirect to the target path, preserving the fid if it exists
    const path = fid ? `${targetPath}?fid=${fid}` : targetPath;
    navigate(path);
  }, [navigate, targetPath, fid]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-center animate-pulse">Redirecting...</p>
    </div>
  );
};

export default FrameRedirect;
