import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileDownloadProps {
  url: string;
  fileName: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const FileDownload: React.FC<FileDownloadProps> = ({
  url,
  fileName,
  variant = 'outline',
  size = 'sm',
  className = ''
}) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to download file');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: 'Download started',
        description: `${fileName} is being downloaded`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download failed',
        description: 'Failed to download the file',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} flex items-center gap-2`}
      onClick={handleDownload}
    >
      <Download className="h-3 w-3" />
      {fileName}
    </Button>
  );
};