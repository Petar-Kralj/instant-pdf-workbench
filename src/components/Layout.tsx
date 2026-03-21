import { Link, useLocation } from 'react-router-dom';
import { FileText, Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
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
      {/* Main nav */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl shadow-soft">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-elevated">
              <FileText className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            LocalPDF
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">Home</Link>
            <Link to="/tools" className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">Tools</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDark(!dark)}
              className="rounded-xl shadow-soft hover:shadow-soft-hover transition-all"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button asChild size="sm" className="hidden md:inline-flex rounded-xl gradient-bg border-0 text-primary-foreground font-semibold gap-1.5 shadow-elevated hover:opacity-90 transition-opacity">
              <Link to="/tools">
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden rounded-xl" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card p-4 space-y-1">
            <Link to="/" className="block px-4 py-2.5 rounded-xl hover:bg-secondary text-sm font-medium">Home</Link>
            <Link to="/tools" className="block px-4 py-2.5 rounded-xl hover:bg-secondary text-sm font-medium">Tools</Link>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-display font-bold text-foreground">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            LocalPDF
          </div>
          <p>100% client-side processing — your files never leave your browser.</p>
        </div>
      </footer>
    </div>
  );
}
