import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import FileDropzone from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getPageCount, extractPages, downloadPdf } from '@/lib/pdf-utils';

export default function ExtractTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setDone(false);
    setError('');
    setSelected(new Set());
    try {
      const count = await getPageCount(f);
      setPageCount(count);
    } catch {
      setError('Could not read PDF');
    }
  };

  const togglePage = (idx: number) => {
    setSelected(prev => {
      const s = new Set(prev);
      if (s.has(idx)) s.delete(idx); else s.add(idx);
      return s;
    });
  };

  const handleExtract = async () => {
    if (!file || selected.size === 0) return;
    setProcessing(true);
    setError('');
    try {
      const indices = Array.from(selected).sort((a, b) => a - b);
      const result = await extractPages(file, indices);
      downloadPdf(result, `extracted_${file.name}`);
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout title="Extract Pages" description="Select specific pages to extract into a new PDF.">
      <FileDropzone accept=".pdf" onFiles={handleFile} />

      {file && pageCount > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{file.name} — {pageCount} pages. Click pages to select.</p>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => togglePage(i)}
                className={`rounded-lg border p-2 text-sm font-medium transition-all ${
                  selected.has(i) ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{selected.size} page{selected.size !== 1 ? 's' : ''} selected</p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {done && (
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Extracted PDF downloaded!</span>
        </div>
      )}

      <Button
        onClick={handleExtract}
        disabled={!file || selected.size === 0 || processing}
        className="w-full rounded-full gradient-bg border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        size="lg"
      >
        {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Extracting...</> : 'Extract & Download'}
      </Button>
    </ToolPageLayout>
  );
}
