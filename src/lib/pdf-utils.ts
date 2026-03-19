import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const bytes = await readFileAsArrayBuffer(file);
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
  }
  return mergedPdf.save();
}

export async function splitPDF(file: File, ranges: { start: number; end: number }[]): Promise<Uint8Array[]> {
  const bytes = await readFileAsArrayBuffer(file);
  const sourcePdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const results: Uint8Array[] = [];
  for (const range of ranges) {
    const newPdf = await PDFDocument.create();
    const indices = [];
    for (let i = range.start - 1; i < range.end && i < sourcePdf.getPageCount(); i++) {
      indices.push(i);
    }
    const pages = await newPdf.copyPages(sourcePdf, indices);
    pages.forEach(p => newPdf.addPage(p));
    results.push(await newPdf.save());
  }
  return results;
}

export async function splitEveryN(file: File, n: number): Promise<Uint8Array[]> {
  const bytes = await readFileAsArrayBuffer(file);
  const sourcePdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = sourcePdf.getPageCount();
  const ranges: { start: number; end: number }[] = [];
  for (let i = 0; i < total; i += n) {
    ranges.push({ start: i + 1, end: Math.min(i + n, total) });
  }
  return splitPDF(file, ranges);
}

export async function compressPDF(file: File): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  // Basic compression: re-save which can reduce size through cleanup
  return pdf.save({ useObjectStreams: true });
}

export async function rotatePages(file: File, rotations: Map<number, number>): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  rotations.forEach((deg, pageIndex) => {
    const page = pdf.getPage(pageIndex);
    page.setRotation(degrees(page.getRotation().angle + deg));
  });
  return pdf.save();
}

export async function reorderPages(file: File, newOrder: number[]): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const sourcePdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(sourcePdf, newOrder);
  pages.forEach(p => newPdf.addPage(p));
  return newPdf.save();
}

export async function extractPages(file: File, pageIndices: number[]): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const sourcePdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(sourcePdf, pageIndices);
  pages.forEach(p => newPdf.addPage(p));
  return newPdf.save();
}

export async function imagesToPdf(imageFiles: File[], pageSize: { width: number; height: number } = { width: 595.28, height: 841.89 }): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  for (const file of imageFiles) {
    const bytes = await readFileAsArrayBuffer(file);
    const uint8 = new Uint8Array(bytes);
    let image;
    if (file.type === 'image/png') {
      image = await pdf.embedPng(uint8);
    } else {
      image = await pdf.embedJpg(uint8);
    }
    const page = pdf.addPage([pageSize.width, pageSize.height]);
    const { width, height } = image.scaleToFit(pageSize.width - 40, pageSize.height - 40);
    page.drawImage(image, {
      x: (pageSize.width - width) / 2,
      y: (pageSize.height - height) / 2,
      width,
      height,
    });
  }
  return pdf.save();
}

export async function addWatermark(file: File, text: string, options: { opacity?: number; fontSize?: number; rotation?: number } = {}): Promise<Uint8Array> {
  const { opacity = 0.3, fontSize = 50, rotation = -45 } = options;
  const bytes = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < pdf.getPageCount(); i++) {
    const page = pdf.getPage(i);
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 2 - (font.widthOfTextAtSize(text, fontSize) / 2),
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(rotation),
    });
  }
  return pdf.save();
}

export async function editMetadata(file: File, meta: { title?: string; author?: string; subject?: string; keywords?: string[] }): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  if (meta.title) pdf.setTitle(meta.title);
  if (meta.author) pdf.setAuthor(meta.author);
  if (meta.subject) pdf.setSubject(meta.subject);
  if (meta.keywords) pdf.setKeywords(meta.keywords);
  return pdf.save();
}

export async function getPageCount(file: File): Promise<number> {
  const bytes = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return pdf.getPageCount();
}

export function downloadPdf(data: Uint8Array, filename: string) {
  const blob = new Blob([data as unknown as ArrayBuffer], { type: 'application/pdf' });
  saveAs(blob, filename);
}

export async function downloadAsZip(files: { data: Uint8Array; name: string }[], zipName: string) {
  const zip = new JSZip();
  files.forEach(f => zip.file(f.name, f.data));
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, zipName);
}

export function downloadBlob(blob: Blob, filename: string) {
  saveAs(blob, filename);
}
