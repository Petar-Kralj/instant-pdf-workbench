import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import FileDropzone from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { readFileAsArrayBuffer } from '@/lib/pdf-utils';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function PdfToWordTool() {
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
      const children: Paragraph[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Extracting page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const lines: string[] = [];
        let lastY: number | null = null;

        for (const item of content.items) {
          if ('str' in item) {
            const y = (item as any).transform?.[5];
            if (lastY !== null && y !== undefined && Math.abs(y - lastY) > 5) {
              lines.push('\n');
            }
            lines.push(item.str);
            lastY = y;
          }
        }

        const pageText = lines.join('');
        const paragraphs = pageText.split('\n').filter(Boolean);

        if (i > 1) {
          children.push(new Paragraph({ pageBreakBefore: true, children: [] }));
        }

        for (const para of paragraphs) {
          children.push(new Paragraph({
            children: [new TextRun({ text: para, font: 'Arial', size: 24 })],
            spacing: { after: 120 },
          }));
        }
      }

      const doc = new Document({
        sections: [{ children }],
      });

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, file.name.replace(/\.pdf$/i, '.docx'));
      setDone(true);
      setProgress('');
    } catch (e: any) {
      setError(e.message || 'Conversion failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout title="PDF to Word" description="Convert PDF documents to editable Word (.docx) files.">
      <FileDropzone accept=".pdf" onFiles={handleFile} />

      {file && pageCount > 0 && (
        <p className="text-sm text-muted-foreground">{file.name} — {pageCount} page{pageCount !== 1 ? 's' : ''}</p>
      )}

      {progress && <p className="text-sm text-muted-foreground">{progress}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {done && (
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Word document downloaded!</span>
        </div>
      )}

      <Button
        onClick={handleConvert}
        disabled={!file || processing}
        className="w-full rounded-full gradient-bg border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        size="lg"
      >
        {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Converting...</> : 'Convert to Word & Download'}
      </Button>
    </ToolPageLayout>
  );
}
