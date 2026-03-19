import { useState } from 'react';
import { Loader2, CheckCircle2, X } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import FileDropzone from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { imagesToPdf, downloadPdf } from '@/lib/pdf-utils';

export default function ImagesToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const addFiles = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles.filter(f => f.type.startsWith('image/'))]);
    setDone(false);
    setError('');
  };

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleConvert = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError('');
    try {
      const result = await imagesToPdf(files);
      downloadPdf(result, 'images.pdf');
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout title="Images to PDF" description="Combine images into a single PDF document.">
      <FileDropzone accept="image/png,image/jpeg,image/jpg" multiple onFiles={addFiles} label="Drop images here" sublabel="PNG or JPEG images" />

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
              <span className="text-sm truncate">{f.name}</span>
              <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {done && (
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">PDF downloaded!</span>
        </div>
      )}

      <Button
        onClick={handleConvert}
        disabled={files.length === 0 || processing}
        className="w-full rounded-full gradient-bg border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        size="lg"
      >
        {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating PDF...</> : 'Create PDF & Download'}
      </Button>
    </ToolPageLayout>
  );
}
