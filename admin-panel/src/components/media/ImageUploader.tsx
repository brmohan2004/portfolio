import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string | null>;
  className?: string;
}

export function ImageUploader({ value, onChange, onUpload, className }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload file
    setIsUploading(true);
    try {
      const url = await onUpload(file);
      if (url) {
        onChange(url);
      }
    } finally {
      setIsUploading(false);
    }
  }, [onUpload, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
  });

  const handleRemove = () => {
    setPreview(null);
    onChange('');
  };

  return (
    <div className={cn('space-y-2', className)}>
      {preview ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-border dark:border-border-dark">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-danger text-white flex items-center justify-center hover:bg-danger/90 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors',
            'flex flex-col items-center justify-center gap-4',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border dark:border-border-dark hover:border-primary/50'
          )}
        >
          <input {...getInputProps()} />
          <div className="w-12 h-12 rounded-full bg-secondary dark:bg-secondary-dark flex items-center justify-center">
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-muted dark:text-muted-dark" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground dark:text-foreground-dark">
              {isDragActive ? 'Drop image here' : 'Drag & drop an image'}
            </p>
            <p className="text-xs text-muted dark:text-muted-dark mt-1">
              or click to browse
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface GalleryUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  onUpload: (file: File) => Promise<string | null>;
}

export function GalleryUploader({ images, onChange, onUpload }: GalleryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      const urls: string[] = [];
      for (const file of acceptedFiles) {
        const url = await onUpload(file);
        if (url) urls.push(url);
      }
      onChange([...images, ...urls]);
    } finally {
      setIsUploading(false);
    }
  }, [images, onChange, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: true,
  });

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border border-border dark:border-border-dark group"
          >
            <img
              src={image}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-danger text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <div
          {...getRootProps()}
          className={cn(
            'aspect-square border-2 border-dashed rounded-lg cursor-pointer transition-colors',
            'flex flex-col items-center justify-center gap-2',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border dark:border-border-dark hover:border-primary/50'
          )}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-6 h-6 text-muted dark:text-muted-dark" />
              <span className="text-xs text-muted dark:text-muted-dark">
                {isDragActive ? 'Drop' : 'Add'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
