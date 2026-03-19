import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import FileDropzone from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { compressPDF, downloadPdf } from '@/lib/pdf-utils';

export default function CompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null);
  const [error, setError] = useState('');

  const handleFile = (files: File[]) => {
    setFile(files[0] || null);
    setDone(false);
    setStats(null);
    setError('');
  };

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    try {
      const result = await compressPDF(file);
      setStats({ original: file.size, compressed: result.length });
      downloadPdf(result, `compressed_${file.name}`);
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Failed to compress');
    } finally {
      setProcessing(false);
    }
  };

  const formatSize = (bytes: number) => bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;

  return (
    <ToolPageLayout title="Compress PDF" description="Reduce PDF file size with basic compression.">
      <FileDropzone accept=".pdf" onFiles={handleFile} label="Drop a PDF file" />

      {file && <p className="text-sm text-muted-foreground">{file.name} — {formatSize(file.size)}</p>}

      {stats && (
        <div className="rounded-lg bg-secondary p-4 text-sm space-y-1">
          <p>Original: {formatSize(stats.original)}</p>
          <p>Compressed: {formatSize(stats.compressed)}</p>
          <p className="font-medium">
            {stats.compressed < stats.original
              ? `Saved ${((1 - stats.compressed / stats.original) * 100).toFixed(1)}%`
              : 'File was already optimized'}
          </p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {done && (
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Compressed PDF downloaded!</span>
        </div>
      )}

      <Button
        onClick={handleCompress}
        disabled={!file || processing}
        className="w-full rounded-full gradient-bg border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        size="lg"
      >
        {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Compressing...</> : 'Compress & Download'}
      </Button>
    </ToolPageLayout>
  );
}
