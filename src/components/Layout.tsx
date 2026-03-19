import { Link, useLocation } from 'react-router-dom';
import { FileText, Sun, Moon, Menu, X } from 'lucide-react';
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
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            LocalPDF Tools
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/tools" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Tools</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} className="rounded-full">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden rounded-full" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background p-4 space-y-2">
            <Link to="/" className="block px-3 py-2 rounded-lg hover:bg-secondary text-sm">Home</Link>
            <Link to="/tools" className="block px-3 py-2 rounded-lg hover:bg-secondary text-sm">Tools</Link>
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Built with client-side PDF tools. Files never leave your device.</p>
        </div>
      </footer>
    </div>
  );
}
