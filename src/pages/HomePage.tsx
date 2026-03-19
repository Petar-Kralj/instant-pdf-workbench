import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Merge, SplitSquareVertical, Minimize2, RotateCw,
  FileOutput, Image, ImagePlus, Droplets, FileText,
  FileSpreadsheet, FileType, FileDown, Table2,
  ArrowUpRight, Shield, Zap, Globe
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

const features = [
  { icon: Shield, title: '100% Private', desc: 'Files are processed locally. Nothing is uploaded to any server.' },
  { icon: Zap, title: 'Instant Processing', desc: 'No waiting. Operations complete in seconds, right in your browser.' },
  { icon: Globe, title: 'Works Everywhere', desc: 'No installs needed. Use on any device with a modern browser.' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero-bg py-24 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="container text-center max-w-4xl relative">
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-6">Free & Open PDF Tools</p>
          <h1 className="text-5xl md:text-7xl font-display leading-[1.1] mb-6">
            Powerful PDF tools,{' '}
            <span className="gradient-text">right in your browser.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Merge, split, compress, convert, and edit PDFs instantly. No login required. Your files never leave your device.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild size="lg" className="rounded-full gradient-bg border-0 text-primary-foreground font-semibold px-8 h-12 shadow-elevated hover:opacity-90 transition-opacity gap-2">
              <Link to="/tools/merge">
                Start with Merge <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 border-border">
              <Link to="/tools">See all tools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-b border-border">
        <div className="container py-12 md:py-16">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {features.map(f => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">Tools</p>
          <h2 className="text-3xl md:text-4xl font-display">Everything you need for PDFs</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(tool => (
            <Link
              key={tool.path}
              to={tool.path}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <tool.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{tool.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
