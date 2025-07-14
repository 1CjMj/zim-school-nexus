import React, { useRef, useState } from 'react';
import { Upload, X, File, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useFileUpload, UploadOptions } from '@/hooks/useFileUpload';

interface FileUploadProps {
  onUpload: (url: string, fileName: string) => void;
  onRemove?: () => void;
  uploadOptions: UploadOptions;
  currentFile?: {
    url: string;
    name: string;
  };
  className?: string;
  multiple?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  onRemove,
  uploadOptions,
  currentFile,
  className = "",
  multiple = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading, progress } = useFileUpload();
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // For now, handle single file
    const url = await uploadFile(file, uploadOptions);
    
    if (url) {
      onUpload(url, file.name);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (imageTypes.includes(extension || '')) {
      return currentFile?.url;
    }
    
    return null;
  };

  if (currentFile) {
    const fileIcon = getFileIcon(currentFile.name);
    
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {fileIcon ? (
              <img 
                src={fileIcon} 
                alt={currentFile.name}
                className="w-10 h-10 object-cover rounded"
              />
            ) : (
              <File className="w-10 h-10 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium">{currentFile.name}</p>
              <p className="text-xs text-muted-foreground">Uploaded</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(currentFile.url, '_blank')}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        multiple={multiple}
        accept={uploadOptions.allowedTypes?.join(',')}
      />
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${uploading ? 'pointer-events-none opacity-50' : 'hover:border-primary hover:bg-primary/5'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {uploading ? (
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-primary animate-bounce" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
            <Progress value={progress} className="w-full max-w-xs mx-auto" />
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Drop files here or click to browse</p>
              <p className="text-xs text-muted-foreground">
                {uploadOptions.maxSizeInMB && `Max size: ${uploadOptions.maxSizeInMB}MB`}
                {uploadOptions.allowedTypes && ` • ${uploadOptions.allowedTypes.join(', ')}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};