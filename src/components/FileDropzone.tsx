import { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  sublabel?: string;
}

export default function FileDropzone({ accept = '.pdf', multiple = false, onFiles, label, sublabel }: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  }, [onFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFiles(files);
    e.target.value = '';
  }, [onFiles]);

  return (
    <label
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-200
        ${dragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/40 hover:bg-secondary/50'}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Upload className="w-6 h-6 text-primary" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground">{label || 'Drop files here or click to browse'}</p>
        <p className="text-sm text-muted-foreground mt-1.5">{sublabel || `Accepts ${accept} files`}</p>
      </div>
      <input type="file" accept={accept} multiple={multiple} onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer" />
    </label>
  );
}
