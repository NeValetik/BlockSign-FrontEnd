import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, Globe, Moon, Sun, ShieldCheck } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Blocksign</span>
        </Link>

        <nav className="flex items-center space-x-6">
          {isAuthenticated && (
            <>
              <Link to="/documents" className="text-sm font-medium transition-colors hover:text-primary">
                {t('nav.documents')}
              </Link>
              <Link to="/account" className="text-sm font-medium transition-colors hover:text-primary">
                {t('nav.account')}
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ro')}>
                Română
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ru')}>
                Русский
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {isAuthenticated ? (
            <Button onClick={logout} variant="outline">
              {t('nav.logout')}
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
              <Button asChild>
                <Link to="/register">{t('nav.register')}</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
