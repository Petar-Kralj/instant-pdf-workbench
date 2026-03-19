import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ToolPageLayout({ title, description, children }: Props) {
  return (
    <div className="container max-w-3xl py-12 space-y-8">
      <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> All Tools
      </Link>
      <div>
        <h1 className="text-3xl md:text-4xl font-display">{title}</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
      <p className="text-xs text-muted-foreground text-center pt-6 border-t border-border">
        Processing happens entirely in your browser. We never store or upload your files.
      </p>
    </div>
  );
}
