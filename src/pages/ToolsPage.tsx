import { Link } from 'react-router-dom';
import {
  Merge, SplitSquareVertical, Minimize2, RotateCw,
  FileOutput, Image, ImagePlus, Droplets, FileText,
  FileSpreadsheet, FileType, FileDown, Table2
} from 'lucide-react';

const tools = [
  { icon: Merge, title: 'Merge PDFs', desc: 'Combine multiple PDFs into one file.', path: '/tools/merge' },
  { icon: SplitSquareVertical, title: 'Split PDF', desc: 'Split a PDF by page ranges or every N pages.', path: '/tools/split' },
  { icon: Minimize2, title: 'Compress PDF', desc: 'Reduce file size with basic compression.', path: '/tools/compress' },
  { icon: RotateCw, title: 'Rotate & Reorder', desc: 'Rotate pages and reorder them with drag-and-drop.', path: '/tools/rotate-reorder' },
  { icon: FileOutput, title: 'Extract Pages', desc: 'Pick specific pages to extract from a PDF.', path: '/tools/extract' },
  { icon: Image, title: 'PDF to Images', desc: 'Convert PDF pages to PNG/JPEG images.', path: '/tools/pdf-to-images' },
  { icon: ImagePlus, title: 'Images to PDF', desc: 'Combine images into a single PDF document.', path: '/tools/images-to-pdf' },
  { icon: Droplets, title: 'Watermark', desc: 'Add text watermark to every page.', path: '/tools/watermark' },
  { icon: FileText, title: 'Edit Metadata', desc: 'Edit title, author, subject, and keywords.', path: '/tools/metadata' },
  { icon: FileSpreadsheet, title: 'Excel to PDF', desc: 'Convert spreadsheets to PDF with tables.', path: '/tools/excel-to-pdf' },
  { icon: FileType, title: 'Word to PDF', desc: 'Convert Word documents to PDF format.', path: '/tools/word-to-pdf' },
  { icon: FileDown, title: 'PDF to Word', desc: 'Convert PDF to editable Word documents.', path: '/tools/pdf-to-word' },
  { icon: Table2, title: 'PDF to Excel', desc: 'Extract tables from PDF into spreadsheets.', path: '/tools/pdf-to-excel' },
];

export default function ToolsPage() {
  return (
    <div className="container py-10 max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Choose a tool</h1>
        <p className="text-muted-foreground mt-1">Select a PDF tool to get started</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map(tool => (
          <Link
            key={tool.path}
            to={tool.path}
            className="group rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition-all duration-200 hover:border-primary/30"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <tool.icon className="w-4.5 h-4.5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">{tool.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tool.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
