import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import FileDropzone from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { readFileAsArrayBuffer } from '@/lib/pdf-utils';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function PdfToExcelTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setDone(false);
    setError('');
    try {
      const bytes = await readFileAsArrayBuffer(f);
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      setPageCount(pdf.numPages);
    } catch {
      setError('Could not read PDF');
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    try {
      const bytes = await readFileAsArrayBuffer(file);
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const wb = XLSX.utils.book_new();

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Extracting page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        // Group items by Y position to detect rows
        const rows = new Map<number, { x: number; text: string }[]>();
        for (const item of content.items) {
          if ('str' in item && item.str.trim()) {
            const y = Math.round((item as any).transform?.[5] ?? 0);
            const x = Math.round((item as any).transform?.[4] ?? 0);
            if (!rows.has(y)) rows.set(y, []);
            rows.get(y)!.push({ x, text: item.str });
          }
        }

        // Sort rows by Y (descending = top to bottom) then cells by X
        const sortedRows = Array.from(rows.entries())
          .sort((a, b) => b[0] - a[0])
          .map(([, cells]) => cells.sort((a, b) => a.x - b.x).map(c => c.text));

        const ws = XLSX.utils.aoa_to_sheet(sortedRows.length > 0 ? sortedRows : [['(empty page)']]);
        XLSX.utils.book_append_sheet(wb, ws, `Page ${i}`);
      }

      const xlsxBytes = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([xlsxBytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, file.name.replace(/\.pdf$/i, '.xlsx'));
      setDone(true);
      setProgress('');
    } catch (e: any) {
      setError(e.message || 'Conversion failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout title="PDF to Excel" description="Extract tables and data from PDF into Excel spreadsheets.">
      <FileDropzone accept=".pdf" onFiles={handleFile} />

      {file && pageCount > 0 && (
        <p className="text-sm text-muted-foreground">{file.name} — {pageCount} page{pageCount !== 1 ? 's' : ''}</p>
      )}

      {progress && <p className="text-sm text-muted-foreground">{progress}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {done && (
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Excel file downloaded!</span>
        </div>
      )}

      <Button
        onClick={handleConvert}
        disabled={!file || processing}
        className="w-full rounded-full gradient-bg border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        size="lg"
      >
        {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Extracting...</> : 'Convert to Excel & Download'}
      </Button>
    </ToolPageLayout>
  );
}
