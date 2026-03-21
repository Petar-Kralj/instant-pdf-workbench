import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Merge, SplitSquareVertical, Minimize2, RotateCw,
  FileOutput, Image, ImagePlus, Droplets, FileText,
  FileSpreadsheet, FileType, FileDown, Table2,
  ArrowRight, Shield, Zap, Globe
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
  { icon: Shield, title: '100% Private', desc: 'Files are processed locally in your browser. Nothing is uploaded.' },
  { icon: Zap, title: 'Instant Processing', desc: 'No waiting. Operations complete in seconds, right here.' },
  { icon: Globe, title: 'Works Everywhere', desc: 'No installs needed. Use on any device with a modern browser.' },
];

const stats = [
  { value: '13+', label: 'PDF Tools' },
  { value: '0', label: 'Files Uploaded' },
  { value: '100%', label: 'Client-Side' },
  { value: '∞', label: 'Free Usage' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container max-w-4xl relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-card shadow-soft px-5 py-2 text-xs font-medium text-muted-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Free & Open PDF Tools
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-[1.1] mb-6 text-foreground">
            Powerful PDF tools,<br />
            <span className="gradient-text">right in your browser.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Merge, split, compress, convert, and edit PDFs instantly. No login required. Your files never leave your device.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild size="lg" className="rounded-xl gradient-bg border-0 text-primary-foreground font-semibold px-8 h-12 shadow-elevated hover:opacity-90 transition-opacity gap-2">
              <Link to="/tools/merge">
                Start with Merge <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl px-8 h-12 shadow-soft hover:shadow-soft-hover transition-all bg-card border-0">
              <Link to="/tools">See all tools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container max-w-3xl pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-card rounded-2xl shadow-soft p-6 text-center">
              <p className="text-2xl md:text-3xl font-display font-bold gradient-text">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container max-w-4xl pb-16">
        <div className="grid md:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title} className="bg-card rounded-2xl shadow-soft p-6 flex flex-col items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools grid */}
      <section className="container py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold">All tools</h2>
          <p className="text-muted-foreground mt-2">Everything you need to work with PDFs</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {tools.map(tool => (
            <Link
              key={tool.path}
              to={tool.path}
              className="group bg-card rounded-2xl shadow-soft hover:shadow-soft-hover p-6 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <tool.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">{tool.title}</h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-2xl pb-20">
        <div className="bg-card rounded-3xl shadow-soft p-10 md:p-14 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">All tools are free, unlimited, and completely private. No sign-up needed.</p>
          <Button asChild size="lg" className="rounded-xl gradient-bg border-0 text-primary-foreground font-semibold px-8 h-12 shadow-elevated hover:opacity-90 transition-opacity gap-2">
            <Link to="/tools">
              Explore all tools <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
