import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/utils';
import type { ProjectPDF } from '@/types';

interface PDFUploaderProps {
  pdfs: ProjectPDF[];
  onChange: (pdfs: ProjectPDF[]) => void;
  onUpload: (file: File) => Promise<string | null>;
}

export function PDFUploader({ pdfs, onChange, onUpload }: PDFUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      const newPdfs: ProjectPDF[] = [];
      for (const file of acceptedFiles) {
        const url = await onUpload(file);
        if (url) {
          newPdfs.push({
            name: file.name,
            url,
            size: file.size,
          });
        }
      }
      onChange([...pdfs, ...newPdfs]);
    } finally {
      setIsUploading(false);
    }
  }, [pdfs, onChange, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  });

  const handleRemove = (index: number) => {
    onChange(pdfs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* PDF List */}
      {pdfs.length > 0 && (
        <div className="space-y-2">
          {pdfs.map((pdf, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg border border-border dark:border-border-dark bg-secondary/50 dark:bg-secondary-dark/50"
            >
              <div 
                className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-danger/10 border border-border dark:border-border-dark flex items-center justify-center flex-shrink-0 cursor-pointer overflow-hidden relative group"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const url = await onUpload(file);
                      if (url) {
                        const newPdfs = [...pdfs];
                        newPdfs[index] = { ...newPdfs[index], thumbnail_url: url };
                        onChange(newPdfs);
                      }
                    }
                  };
                  input.click();
                }}
              >
                {pdf.thumbnail_url ? (
                  <img src={pdf.thumbnail_url} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="w-4 h-4 md:w-6 md:h-6" />
                    <span className="text-[8px] uppercase font-bold text-center">Add Drwg</span>
                  </div>
                )}
                {/* Overlay for hover */}
                {pdf.thumbnail_url && (
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[8px] uppercase font-bold text-center px-1">
                     Change Drawing
                   </div>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <input
                  type="text"
                  value={pdf.name}
                  onChange={(e) => {
                    const newPdfs = [...pdfs];
                    newPdfs[index] = { ...newPdfs[index], name: e.target.value };
                    onChange(newPdfs);
                  }}
                  className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-foreground dark:text-foreground-dark px-0 py-0"
                />
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1 text-[10px] text-danger font-bold uppercase tracking-wider">
                     <FileText className="w-3 h-3" />
                     PDF
                   </div>
                  {pdf.size && (
                    <p className="text-[10px] text-muted dark:text-muted-dark font-mono">
                      {formatFileSize(pdf.size)}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemove(index)}
                className="w-8 h-8 rounded-lg hover:bg-danger/10 flex items-center justify-center text-muted hover:text-danger transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors',
          'flex flex-col items-center justify-center gap-3',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border dark:border-border-dark hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="w-10 h-10 rounded-full bg-secondary dark:bg-secondary-dark flex items-center justify-center">
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-5 h-5 text-muted dark:text-muted-dark" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground dark:text-foreground-dark">
            {isDragActive ? 'Drop PDFs here' : 'Drag & drop PDF files'}
          </p>
          <p className="text-xs text-muted dark:text-muted-dark mt-1">
            or click to browse
          </p>
        </div>
      </div>
    </div>
  );
}
