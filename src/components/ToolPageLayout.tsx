import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ToolPageLayout({ title, description, children }: Props) {
  return (
    <div className="container max-w-2xl py-10 space-y-8">
      <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> All Tools
      </Link>
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-semibold">{title}</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
      <p className="text-xs text-muted-foreground text-center pt-6 border-t border-border">
        Processing happens entirely in your browser. We never store or upload your files.
      </p>
    </div>
  );
}
