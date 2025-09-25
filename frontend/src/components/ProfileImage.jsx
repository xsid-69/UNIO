import React, { useState } from 'react';
import { User } from 'lucide-react';

const ProfileImage = ({ src, className = "", size = "md" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-20 h-20"
  };

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Default avatar shown while loading or on error */}
      <div className={`absolute inset-0 flex items-center justify-center bg-gray-700 rounded-full ${!isLoading && !error ? 'hidden' : ''}`}>
        <User className="w-1/2 h-1/2 text-gray-400" />
      </div>
      
      {/* Actual image */}
      {src && (
        <img
          src={src}
          alt="Profile"
          className={`w-full h-full rounded-full object-cover transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default ProfileImage;