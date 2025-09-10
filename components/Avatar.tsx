import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  // Generate initials from name
  const getInitials = (name: string) => {
    if (!name) return 'U';
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const initials = getInitials(name);

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-br from-blue-500 to-blue-600 
        flex items-center justify-center 
        text-white font-semibold 
        shadow-md
        ${className}
      `}
      title={name}
    >
      {initials}
    </div>
  );
}
