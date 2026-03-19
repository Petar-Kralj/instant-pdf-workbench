import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ToolPageLayout({ title, description, children }: Props) {
  return (
    <div className="container max-w-3xl py-10 space-y-6">
      <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> All Tools
      </Link>
      <div>
        <h1 className="text-3xl font-display font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
      <p className="text-xs text-muted-foreground text-center pt-4">Processing happens in your browser. We don't store your files.</p>
    </div>
  );
}
