import { Link } from 'react-router-dom';
import {
  Merge, SplitSquareVertical, Minimize2, RotateCw,
  FileOutput, Image, ImagePlus, Droplets, FileText,
  FileSpreadsheet, FileType, FileDown, Table2
} from 'lucide-react';

const tools = [
  { icon: Merge, title: 'Merge PDFs', desc: 'Combine multiple PDFs into one file', path: '/tools/merge' },
  { icon: SplitSquareVertical, title: 'Split PDF', desc: 'Split a PDF by page ranges or every N pages', path: '/tools/split' },
  { icon: Minimize2, title: 'Compress PDF', desc: 'Reduce file size with basic compression', path: '/tools/compress' },
  { icon: RotateCw, title: 'Rotate & Reorder', desc: 'Rotate pages and reorder them', path: '/tools/rotate-reorder' },
  { icon: FileOutput, title: 'Extract Pages', desc: 'Pick specific pages to extract', path: '/tools/extract' },
  { icon: Image, title: 'PDF to Images', desc: 'Convert PDF pages to PNG/JPEG', path: '/tools/pdf-to-images' },
  { icon: ImagePlus, title: 'Images to PDF', desc: 'Combine images into a PDF', path: '/tools/images-to-pdf' },
  { icon: Droplets, title: 'Watermark', desc: 'Add text watermark to every page', path: '/tools/watermark' },
  { icon: FileText, title: 'Edit Metadata', desc: 'Edit title, author, subject', path: '/tools/metadata' },
  { icon: FileSpreadsheet, title: 'Excel to PDF', desc: 'Convert spreadsheets to PDF', path: '/tools/excel-to-pdf' },
  { icon: FileType, title: 'Word to PDF', desc: 'Convert Word documents to PDF', path: '/tools/word-to-pdf' },
  { icon: FileDown, title: 'PDF to Word', desc: 'Convert PDF to editable Word', path: '/tools/pdf-to-word' },
  { icon: Table2, title: 'PDF to Excel', desc: 'Extract tables from PDF', path: '/tools/pdf-to-excel' },
];

export default function ToolsPage() {
  return (
    <div className="container py-12 max-w-2xl">
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-display font-semibold">All Tools</h1>
        <p className="text-muted-foreground mt-2 text-sm">Select a PDF tool to get started.</p>
      </div>
      <div className="space-y-0">
        {tools.map((tool, i) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="group flex items-baseline py-2.5 hover:bg-accent/50 -mx-3 px-3 rounded-md transition-colors"
          >
            <span className="font-medium text-sm text-foreground group-hover:underline underline-offset-4">
              {tool.title}
            </span>
            <span className="text-muted-foreground text-sm ml-2 hidden sm:inline">
              | <span className="ml-2">{tool.desc}</span>
            </span>
            <span className="dotted-line hidden sm:block" />
            <span className="text-sm text-muted-foreground tabular-nums ml-auto sm:ml-0">
              {i + 1}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
