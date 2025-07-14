import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UploadOptions {
  bucket: string;
  folder?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const validateFile = (file: File, options: UploadOptions): boolean => {
    // Check file size
    if (options.maxSizeInMB) {
      const maxSize = options.maxSizeInMB * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `File must be smaller than ${options.maxSizeInMB}MB`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Check file type
    if (options.allowedTypes && options.allowedTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isAllowed = options.allowedTypes.some(type => 
        type.includes('*') ? 
          file.type.startsWith(type.replace('*', '')) :
          file.type === type || fileExtension === type.replace('.', '')
      );
      
      if (!isAllowed) {
        toast({
          title: "Invalid file type",
          description: `Only ${options.allowedTypes.join(', ')} files are allowed`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const uploadFile = async (file: File, options: UploadOptions): Promise<string | null> => {
    if (!validateFile(file, options)) {
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${fileExtension}`;
      
      // Construct file path
      const filePath = options.folder ? `${options.folder}/${fileName}` : fileName;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file);

      clearInterval(progressInterval);
      setProgress(100);

      if (error) {
        throw error;
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath);

      toast({
        title: "Upload successful",
        description: "File uploaded successfully",
      });

      return urlData.publicUrl;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteFile = async (filePath: string, bucket: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        throw error;
      }

      toast({
        title: "File deleted",
        description: "File deleted successfully",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    progress,
  };
};