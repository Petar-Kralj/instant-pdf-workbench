import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import FileDropzone from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addWatermark, downloadPdf } from '@/lib/pdf-utils';

export default function WatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(50);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (files: File[]) => {
    setFile(files[0] || null);
    setDone(false);
    setError('');
  };

  const handleApply = async () => {
    if (!file || !text) return;
    setProcessing(true);
    setError('');
    try {
      const result = await addWatermark(file, text, { opacity, fontSize });
      downloadPdf(result, `watermarked_${file.name}`);
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout title="Add Watermark" description="Add text watermark to every page of a PDF.">
      <FileDropzone accept=".pdf" onFiles={handleFile} />

      {file && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{file.name}</p>
          <div>
            <label className="text-sm font-medium">Watermark text</label>
            <Input value={text} onChange={e => setText(e.target.value)} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Opacity ({opacity})</label>
              <input type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="w-full mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Font size</label>
              <Input type="number" min={10} max={200} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="mt-1" />
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {done && (
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Watermarked PDF downloaded!</span>
        </div>
      )}

      <Button
        onClick={handleApply}
        disabled={!file || !text || processing}
        className="w-full rounded-full gradient-bg border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        size="lg"
      >
        {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Applying...</> : 'Apply Watermark & Download'}
      </Button>
    </ToolPageLayout>
  );
}
