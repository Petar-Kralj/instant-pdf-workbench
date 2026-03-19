import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import FileDropzone from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import mammoth from 'mammoth';
import { saveAs } from 'file-saver';
import { readFileAsArrayBuffer } from '@/lib/pdf-utils';

export default function WordToPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');
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
      const bytes = await readFileAsArrayBuffer(f);
      const result = await mammoth.convertToHtml({ arrayBuffer: bytes });
      setPreviewHtml(result.value);
    } catch {
      setError('Could not read Word file');
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    try {
      const bytes = await readFileAsArrayBuffer(file);
      const result = await mammoth.extractRawText({ arrayBuffer: bytes });
      const text = result.value;

      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 11;
      const lineHeight = fontSize * 1.5;
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 50;
      const maxWidth = pageWidth - margin * 2;

      const lines = text.split('\n');
      let page = pdf.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      for (const line of lines) {
        if (line.trim() === '') {
          y -= lineHeight;
          if (y < margin) {
            page = pdf.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
          continue;
        }

        // Word-wrap long lines
        const words = line.split(' ');
        let currentLine = '';
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const width = font.widthOfTextAtSize(testLine, fontSize);
          if (width > maxWidth && currentLine) {
            page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
            y -= lineHeight;
            if (y < margin) {
              page = pdf.addPage([pageWidth, pageHeight]);
              y = pageHeight - margin;
            }
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
          y -= lineHeight;
          if (y < margin) {
            page = pdf.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
        }
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      saveAs(blob, file.name.replace(/\.docx?$/i, '.pdf'));
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Conversion failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout title="Word to PDF" description="Convert Word documents to PDF format.">
      <FileDropzone accept=".docx,.doc" onFiles={handleFile} label="Drop a Word file" sublabel=".docx or .doc files" />

      {previewHtml && (
        <div className="rounded-lg border border-border bg-card p-4 max-h-64 overflow-auto prose prose-sm max-w-none text-foreground">
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
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
        disabled={!file || processing}
        className="w-full rounded-full gradient-bg border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        size="lg"
      >
        {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Converting...</> : 'Convert to PDF & Download'}
      </Button>
    </ToolPageLayout>
  );
}
