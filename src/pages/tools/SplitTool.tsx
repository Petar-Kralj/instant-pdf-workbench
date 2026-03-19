import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import FileDropzone from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { splitPDF, splitEveryN, downloadAsZip, getPageCount } from '@/lib/pdf-utils';

export default function SplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<'ranges' | 'every'>('ranges');
  const [rangesText, setRangesText] = useState('');
  const [everyN, setEveryN] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setDone(false);
    setError('');
    try {
      const count = await getPageCount(f);
      setPageCount(count);
    } catch {
      setError('Could not read PDF');
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    try {
      let results: Uint8Array[];
      if (mode === 'every') {
        results = await splitEveryN(file, everyN);
      } else {
        const ranges = rangesText.split(',').map(r => {
          const [s, e] = r.trim().split('-').map(Number);
          return { start: s, end: e || s };
        });
        results = await splitPDF(file, ranges);
      }
      await downloadAsZip(
        results.map((d, i) => ({ data: d, name: `split_${i + 1}.pdf` })),
        'split_pdfs.zip'
      );
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Failed to split');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout title="Split PDF" description="Split a PDF into multiple files by page ranges.">
      <FileDropzone accept=".pdf" onFiles={handleFile} label="Drop a PDF file" />

      {file && pageCount > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{file.name} — {pageCount} page{pageCount !== 1 ? 's' : ''}</p>
          <div className="flex gap-2">
            <Button variant={mode === 'ranges' ? 'default' : 'outline'} size="sm" onClick={() => setMode('ranges')}>By Ranges</Button>
            <Button variant={mode === 'every' ? 'default' : 'outline'} size="sm" onClick={() => setMode('every')}>Every N Pages</Button>
          </div>
          {mode === 'ranges' ? (
            <div>
              <label className="text-sm font-medium">Page ranges (e.g. 1-3, 4-8)</label>
              <Input value={rangesText} onChange={e => setRangesText(e.target.value)} placeholder="1-3, 4-8" className="mt-1" />
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium">Split every N pages</label>
              <Input type="number" min={1} value={everyN} onChange={e => setEveryN(Number(e.target.value))} className="mt-1 w-32" />
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {done && (
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Split files downloaded as ZIP!</span>
        </div>
      )}

      <Button
        onClick={handleSplit}
        disabled={!file || processing || (mode === 'ranges' && !rangesText)}
        className="w-full rounded-full gradient-bg border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        size="lg"
      >
        {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Splitting...</> : 'Split & Download'}
      </Button>
    </ToolPageLayout>
  );
}
