import { Link, useLocation } from 'react-router-dom';
import { FileText, Sun, Moon, Menu, X, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top nav — minimal like frappe */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container flex items-center justify-between h-12">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
              <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              LocalPDF
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {location.pathname === '/' ? 'Home' : location.pathname.startsWith('/tools/') ? 'Tool' : 'Tools'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDark(!dark)}
              className="h-8 w-8 rounded-md"
            >
              {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </Button>
            <nav className="hidden md:flex items-center gap-1 text-sm">
              <Link to="/" className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">Home</Link>
              <Link to="/tools" className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">Tools</Link>
            </nav>
            <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 rounded-md" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background p-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-accent text-sm">Home</Link>
            <Link to="/tools" className="block px-3 py-2 rounded-md hover:bg-accent text-sm">Tools</Link>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          100% client-side processing — your files never leave your browser.
        </div>
      </footer>
    </div>
  );
}
