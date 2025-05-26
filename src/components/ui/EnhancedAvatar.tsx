import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EnhancedAvatarProps {
  user: {
    id?: number;
    fullName?: string;
    photoUrl?: string | null;
  };
  className?: string;
  fallbackClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Enhanced Avatar component that handles proper display of user profile pictures
 * with consistent fallbacks across the application.
 */
const EnhancedAvatar: React.FC<EnhancedAvatarProps> = ({
  user,
  className = '',
  fallbackClassName = '',
  size = 'md',
}) => {
  // Get user initials for fallback
  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  };

  // Determine the image URL - handle both relative and absolute URLs
  const getImageUrl = () => {
    if (!user.photoUrl) return '';
    
    // If it's already an absolute URL, use it as is
    if (user.photoUrl.startsWith('http')) {
      return user.photoUrl;
    }
    
    // Otherwise, construct the URL using the API base URL
    if (user.id) {
      return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/talents/${user.id}/picture`;
    }
    
    return user.photoUrl;
  };

  const imageUrl = getImageUrl();
  const initials = getInitials(user.fullName);
  
  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {imageUrl && (
        <AvatarImage 
          src={imageUrl} 
          alt={user.fullName || "User"}
          onError={(e) => {
            // On error, try to load a UI Avatars fallback
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=0D9488&color=fff`;
          }}
        />
      )}
      <AvatarFallback className={fallbackClassName}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default EnhancedAvatar;
