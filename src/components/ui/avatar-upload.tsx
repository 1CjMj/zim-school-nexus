import React from 'react';
import { Camera, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/useFileUpload';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onUpload: (url: string) => void;
  userId?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  onUpload,
  userId,
  size = 'md',
  className = "",
}) => {
  const { uploadFile, uploading } = useFileUpload();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32',
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const url = await uploadFile(file, {
      bucket: 'avatars',
      folder: userId || 'user',
      maxSizeInMB: 5,
      allowedTypes: ['image/*', 'jpg', 'jpeg', 'png', 'gif', 'webp'],
    });

    if (url) {
      onUpload(url);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
      
      <div className={`relative ${sizeClasses[size]}`}>
        <Avatar className="w-full h-full">
          <AvatarImage src={currentAvatarUrl} />
          <AvatarFallback>
            <User className="w-1/2 h-1/2" />
          </AvatarFallback>
        </Avatar>
        
        <Button
          size="sm"
          variant="secondary"
          className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
          onClick={handleClick}
          disabled={uploading}
        >
          <Camera className="w-4 h-4" />
        </Button>
      </div>
      
      {uploading && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};