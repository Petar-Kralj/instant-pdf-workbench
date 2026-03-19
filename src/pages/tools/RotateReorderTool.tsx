import { useState } from 'react';
import { Loader2, CheckCircle2, RotateCw } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import FileDropzone from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { getPageCount, rotatePages, reorderPages, downloadPdf } from '@/lib/pdf-utils';

export default function RotateReorderTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotations, setRotations] = useState<Map<number, number>>(new Map());
  const [order, setOrder] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setDone(false);
    setError('');
    setRotations(new Map());
    try {
      const count = await getPageCount(f);
      setPageCount(count);
      setOrder(Array.from({ length: count }, (_, i) => i));
    } catch {
      setError('Could not read PDF');
    }
  };

  const rotatePage = (idx: number) => {
    setRotations(prev => {
      const m = new Map(prev);
      m.set(idx, (m.get(idx) || 0) + 90);
      return m;
    });
  };

  const movePage = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    setOrder(prev => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    try {
      let result: Uint8Array;
      // First reorder, then rotate
      const reordered = await reorderPages(file, order);
      const tempFile = new File([reordered.buffer as ArrayBuffer], file.name, { type: 'application/pdf' });
      
      // Map rotations to new indices
      const newRotations = new Map<number, number>();
      order.forEach((origIdx, newIdx) => {
        const rot = rotations.get(origIdx);
        if (rot) newRotations.set(newIdx, rot);
      });
      
      if (newRotations.size > 0) {
        result = await rotatePages(tempFile, newRotations);
      } else {
        result = reordered;
      }
      downloadPdf(result, `edited_${file.name}`);
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout title="Rotate & Reorder" description="Rotate individual pages and reorder them.">
      <FileDropzone accept=".pdf" onFiles={handleFile} />

      {file && pageCount > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{file.name} — {pageCount} pages</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {order.map((origIdx, i) => (
              <div key={i} className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-2 text-center">
                <span className="text-xs font-medium">P{origIdx + 1}</span>
                <span className="text-[10px] text-muted-foreground">{rotations.get(origIdx) ? `${rotations.get(origIdx)}°` : ''}</span>
                <div className="flex gap-1">
                  <button onClick={() => rotatePage(origIdx)} className="text-primary hover:text-primary/80">
                    <RotateCw className="w-3 h-3" />
                  </button>
                  {i > 0 && <button onClick={() => movePage(i, i - 1)} className="text-xs text-muted-foreground hover:text-foreground">←</button>}
                  {i < order.length - 1 && <button onClick={() => movePage(i, i + 1)} className="text-xs text-muted-foreground hover:text-foreground">→</button>}
                </div>
              </div>
            ))}
          </div>
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
        onClick={handleProcess}
        disabled={!file || processing}
        className="w-full rounded-full gradient-bg border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        size="lg"
      >
        {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : 'Apply & Download'}
      </Button>
    </ToolPageLayout>
  );
}
