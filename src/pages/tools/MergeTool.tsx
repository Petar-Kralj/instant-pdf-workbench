import { useState } from 'react';
import { GripVertical, X, Loader2, CheckCircle2 } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import FileDropzone from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { mergePDFs, downloadPdf } from '@/lib/pdf-utils';

export default function MergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const addFiles = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles.filter(f => f.type === 'application/pdf')]);
    setDone(false);
    setError('');
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setDone(false);
  };

  const moveFile = (from: number, to: number) => {
    setFiles(prev => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    setError('');
    try {
      const result = await mergePDFs(files);
      downloadPdf(result, 'merged.pdf');
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout title="Merge PDFs" description="Combine multiple PDF files into one document.">
      <FileDropzone accept=".pdf" multiple onFiles={addFiles} label="Drop PDF files here" sublabel="Select multiple PDF files to merge" />

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{files.length} file{files.length > 1 ? 's' : ''} selected</p>
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {i > 0 && (
                  <button onClick={() => moveFile(i, i - 1)} className="text-xs text-muted-foreground hover:text-foreground">↑</button>
                )}
                {i < files.length - 1 && (
                  <button onClick={() => moveFile(i, i + 1)} className="text-xs text-muted-foreground hover:text-foreground">↓</button>
                )}
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
              </div>
              <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {done && (
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Merged PDF downloaded!</span>
        </div>
      )}

      <Button
        onClick={handleMerge}
        disabled={files.length < 2 || processing}
        className="w-full rounded-full gradient-bg border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        size="lg"
      >
        {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Merging...</> : 'Merge & Download'}
      </Button>
    </ToolPageLayout>
  );
}
