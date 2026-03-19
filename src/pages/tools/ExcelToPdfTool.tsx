import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import FileDropzone from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { readFileAsArrayBuffer } from '@/lib/pdf-utils';

export default function ExcelToPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][] | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState(0);
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
      const wb = XLSX.read(bytes, { type: 'array' });
      setSheetNames(wb.SheetNames);
      setSelectedSheet(0);
      loadSheet(wb, 0);
    } catch {
      setError('Could not read Excel file');
    }
  };

  const loadSheet = (wb: XLSX.WorkBook, idx: number) => {
    const ws = wb.Sheets[wb.SheetNames[idx]];
    const data: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as string[][];
    setPreview(data.slice(0, 20));
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    try {
      const bytes = await readFileAsArrayBuffer(file);
      const wb = XLSX.read(bytes, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[selectedSheet]];
      const data: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as string[][];

      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 8;
      const cellPadding = 4;
      const pageWidth = 841.89; // A4 landscape
      const pageHeight = 595.28;
      const margin = 40;

      if (data.length === 0) throw new Error('Sheet is empty');

      const maxCols = Math.max(...data.map(r => r.length));
      const colWidth = (pageWidth - margin * 2) / Math.max(maxCols, 1);
      const rowHeight = fontSize + cellPadding * 2 + 2;
      const rowsPerPage = Math.floor((pageHeight - margin * 2) / rowHeight);

      for (let startRow = 0; startRow < data.length; startRow += rowsPerPage) {
        const page = pdf.addPage([pageWidth, pageHeight]);
        const rows = data.slice(startRow, startRow + rowsPerPage);

        rows.forEach((row, ri) => {
          const y = pageHeight - margin - (ri + 1) * rowHeight;
          for (let ci = 0; ci < maxCols; ci++) {
            const x = margin + ci * colWidth;
            // Draw cell border
            page.drawRectangle({
              x, y, width: colWidth, height: rowHeight,
              borderColor: rgb(0.8, 0.8, 0.8), borderWidth: 0.5,
              color: ri === 0 && startRow === 0 ? rgb(0.93, 0.93, 0.96) : rgb(1, 1, 1),
            });
            // Draw text
            const text = String(row[ci] ?? '').substring(0, 30);
            const isHeader = ri === 0 && startRow === 0;
            page.drawText(text, {
              x: x + cellPadding,
              y: y + cellPadding,
              size: fontSize,
              font: isHeader ? boldFont : font,
              color: rgb(0.1, 0.1, 0.1),
              maxWidth: colWidth - cellPadding * 2,
            });
          }
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      saveAs(blob, file.name.replace(/\.xlsx?$/i, '.pdf'));
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Conversion failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout title="Excel to PDF" description="Convert spreadsheets to PDF with tables preserved.">
      <FileDropzone accept=".xlsx,.xls" onFiles={handleFile} label="Drop an Excel file" sublabel=".xlsx or .xls files" />

      {file && sheetNames.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {sheetNames.map((name, i) => (
            <Button key={i} size="sm" variant={selectedSheet === i ? 'default' : 'outline'} onClick={() => setSelectedSheet(i)}>
              {name}
            </Button>
          ))}
        </div>
      )}

      {preview && preview.length > 0 && (
        <div className="overflow-auto rounded-lg border border-border max-h-64">
          <table className="w-full text-xs">
            <tbody>
              {preview.map((row, ri) => (
                <tr key={ri} className={ri === 0 ? 'bg-secondary font-medium' : ''}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border-b border-border px-2 py-1 whitespace-nowrap">{String(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
