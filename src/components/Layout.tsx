import { Link, useLocation } from 'react-router-dom';
import { FileText, Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 font-display text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            LocalPDF
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">Home</Link>
            <Link to="/tools" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">Tools</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} className="rounded-full">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button asChild size="sm" className="hidden md:inline-flex rounded-full gradient-bg border-0 text-primary-foreground font-medium gap-1.5">
              <Link to="/tools">
                Get started <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden rounded-full" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background p-4 space-y-1">
            <Link to="/" className="block px-4 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium">Home</Link>
            <Link to="/tools" className="block px-4 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium">Tools</Link>
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-display text-foreground">
            <div className="w-6 h-6 rounded-md gradient-bg flex items-center justify-center">
              <FileText className="w-3 h-3 text-primary-foreground" />
            </div>
            LocalPDF
          </div>
          <p>100% client-side. Your files never leave your browser.</p>
        </div>
      </footer>
    </div>
  );
}
