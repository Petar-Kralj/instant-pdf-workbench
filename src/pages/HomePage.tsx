import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Merge, SplitSquareVertical, Minimize2, RotateCw,
  FileOutput, Image, ImagePlus, Droplets, FileText,
  FileSpreadsheet, FileType, FileDown, Table2,
  ArrowRight
} from 'lucide-react';

const sections = [
  {
    heading: 'I. Core Tools',
    items: [
      { icon: Merge, title: 'Merge PDFs', desc: 'Combine multiple PDFs into one file', path: '/tools/merge' },
      { icon: SplitSquareVertical, title: 'Split PDF', desc: 'Split a PDF by page ranges or every N pages', path: '/tools/split' },
      { icon: Minimize2, title: 'Compress PDF', desc: 'Reduce file size with basic compression', path: '/tools/compress' },
      { icon: RotateCw, title: 'Rotate & Reorder', desc: 'Rotate pages and reorder them with drag-and-drop', path: '/tools/rotate-reorder' },
      { icon: FileOutput, title: 'Extract Pages', desc: 'Pick specific pages to extract from a PDF', path: '/tools/extract' },
    ],
  },
  {
    heading: 'II. Image Conversion',
    items: [
      { icon: Image, title: 'PDF to Images', desc: 'Convert PDF pages to PNG/JPEG images', path: '/tools/pdf-to-images' },
      { icon: ImagePlus, title: 'Images to PDF', desc: 'Combine images into a single PDF document', path: '/tools/images-to-pdf' },
    ],
  },
  {
    heading: 'III. Document Conversion',
    items: [
      { icon: FileSpreadsheet, title: 'Excel to PDF', desc: 'Convert spreadsheets to PDF with tables', path: '/tools/excel-to-pdf' },
      { icon: FileType, title: 'Word to PDF', desc: 'Convert Word documents to PDF format', path: '/tools/word-to-pdf' },
      { icon: FileDown, title: 'PDF to Word', desc: 'Convert PDF to editable Word documents', path: '/tools/pdf-to-word' },
      { icon: Table2, title: 'PDF to Excel', desc: 'Extract tables from PDF into spreadsheets', path: '/tools/pdf-to-excel' },
    ],
  },
  {
    heading: 'IV. Editing',
    items: [
      { icon: Droplets, title: 'Watermark', desc: 'Add text watermark to every page', path: '/tools/watermark' },
      { icon: FileText, title: 'Edit Metadata', desc: 'Edit title, author, subject, and keywords', path: '/tools/metadata' },
    ],
  },
];

export default function HomePage() {
  let counter = 0;

  return (
    <div className="container max-w-2xl py-20 md:py-28">
      {/* Hero — editorial, centered, minimal */}
      <div className="text-center mb-16">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6">
          Client-Side PDF Tools
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display leading-[1.2] mb-5 text-foreground">
          Hello, we are Fonatica!
        </h1>
        <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          We build powerful PDF tools that run entirely in your browser. No uploads, no login, completely free.
        </p>
      </div>

      {/* Divider */}
      <div className="flex justify-center mb-16">
        <div className="w-24 border-t border-foreground" />
      </div>

      {/* Table of contents — frappe style */}
      <div className="space-y-10">
        {sections.map(section => (
          <div key={section.heading}>
            <h2 className="font-display text-xl md:text-2xl font-semibold mb-4 text-foreground">
              {section.heading}
            </h2>
            <div className="space-y-0">
              {section.items.map(item => {
                counter++;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="group flex items-baseline py-2.5 hover:bg-accent/50 -mx-3 px-3 rounded-md transition-colors"
                  >
                    <span className="font-medium text-sm text-foreground group-hover:underline underline-offset-4">
                      {item.title}
                    </span>
                    <span className="text-muted-foreground text-sm ml-2 hidden sm:inline">
                      | <span className="ml-2">{item.desc}</span>
                    </span>
                    <span className="dotted-line hidden sm:block" />
                    <span className="text-sm text-muted-foreground tabular-nums ml-auto sm:ml-0">
                      {counter}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <Button asChild size="lg" className="rounded-md font-semibold gap-2 h-11 px-8">
          <Link to="/tools">
            Open all tools <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
