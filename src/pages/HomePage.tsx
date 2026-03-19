import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Merge, SplitSquareVertical, Minimize2, RotateCw,
  FileOutput, Image, ImagePlus, Droplets, FileText
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
];

export default function HomePage() {
  return (
    <>
      <section className="gradient-hero-bg py-24 md:py-32">
        <div className="container text-center max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
            Powerful PDF tools, <span className="gradient-text">right in your browser.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Merge, split, compress, and edit PDFs instantly. No login. Files never leave your device.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild size="lg" className="rounded-full gradient-bg border-0 text-primary-foreground font-semibold px-8 shadow-elevated hover:opacity-90 transition-opacity">
              <Link to="/tools/merge">Start with Merge PDF</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link to="/tools">See all tools</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <h2 className="text-2xl font-display font-bold text-center mb-10">All Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(tool => (
            <Link
              key={tool.path}
              to={tool.path}
              className="group rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <tool.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold">{tool.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
