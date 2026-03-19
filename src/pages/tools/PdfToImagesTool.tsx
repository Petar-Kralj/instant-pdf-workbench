import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import FileDropzone from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { readFileAsArrayBuffer } from '@/lib/pdf-utils';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function PdfToImagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleFile = (files: File[]) => {
    setFile(files[0] || null);
    setDone(false);
    setError('');
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    try {
      const bytes = await readFileAsArrayBuffer(file);
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const zip = new JSZip();

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Rendering page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(b => resolve(b!), 'image/png');
        });
        zip.file(`page_${i}.png`, blob);
      }

      setProgress('Creating ZIP...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'pdf_images.zip');
      setDone(true);
      setProgress('');
    } catch (e: any) {
      setError(e.message || 'Conversion failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout title="PDF to Images" description="Convert each PDF page to a PNG image.">
      <FileDropzone accept=".pdf" onFiles={handleFile} />
      {file && <p className="text-sm text-muted-foreground">{file.name}</p>}
      {progress && <p className="text-sm text-muted-foreground">{progress}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {done && (
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Images downloaded as ZIP!</span>
        </div>
      )}
      <Button
        onClick={handleConvert}
        disabled={!file || processing}
        className="w-full rounded-full gradient-bg border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        size="lg"
      >
        {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Converting...</> : 'Convert & Download'}
      </Button>
    </ToolPageLayout>
  );
}
