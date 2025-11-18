'use client';

import { FC, useState, useEffect } from "react";
import { useUserContext } from "@/contexts/userContext";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";

import Button from "@/components/Form/Button";
import LanguageSelector from "@/components/LanguageSelector";
import Link from "next/link";
// import Profile from "@/components/Profile";
import { Menu, X, Shield, ShieldCheck, Moon, Sun } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";

const Header:FC = () => {
  const { me } = useUserContext();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: '/' });
    localStorage.removeItem('privateKey');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const currentTheme = mounted ? theme : 'light';

  const isAuthenticated = !!me;
  const isAdmin = me?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-accent">
      <div className="flex h-16 items-center justify-between md:mx-24">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-brand" />
          <span className="font-bold text-xl">Blocksign</span>
        </Link>

        <nav className="flex items-center space-x-6">
          <>
            <Link href="/verify-doc">
              <Button variant="ghost" size="default">
                  {t('nav.documents') || t('navigation.documents') || 'Verify Document'}
              </Button>
            </Link>
            {isAuthenticated && (
              <>
                
                <Link href="/account/profile" className="text-sm font-medium transition-colors hover:text-primary">
                  <Button variant="ghost" size="default">
                    {t('nav.account') || t('navigation.profile') || 'Account'}
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/adminconsole" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                    <Button variant="ghost" size="default">
                      <ShieldCheck className="size-4" />
                      Admin
                    </Button>
                  </Link>
                )}
              </>
            )}
          </>

          <LanguageSelector />

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {currentTheme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>

          {isAuthenticated ? (
            <Button onClick={handleLogout} variant="outline">
              {t('nav.logout') || t('navigation.logout') || 'Logout'}
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link href="/login">{t('nav.login') || t('navigation.login') || 'Login'}</Link>
              </Button>
              <Button asChild variant="brand">
                <Link href="/register">{t('nav.register') || t('navigation.register') || 'Register'}</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-6 space-y-4">
            {isAuthenticated && (
              <>
                <Link 
                  href="/verify-doc"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-medium transition-colors hover:text-primary hover:bg-"
                >
                  {t('nav.documents') || t('navigation.documents') || 'Documents'}
                </Link>
                <Link 
                  href="/account/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-medium transition-colors hover:text-primary"
                >
                  {t('nav.account') || t('navigation.profile') || 'Account'}
                </Link>
                {isAdmin && (
                  <Link 
                    href="/adminconsole"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </Link>
                )}
              </>
            )}
            <LanguageSelector />
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-full justify-start">
              {currentTheme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
              {currentTheme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
            
            {isAuthenticated ? (
              <Button 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }} 
                variant="outline" 
                size="sm" 
                className="w-full"
              >
                {t('nav.logout') || t('navigation.logout') || 'Logout'}
              </Button>
            ) : (
              <div className="space-y-2">
                <Link 
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button variant="ghost" size="sm" className="w-full">
                    {t('nav.register') || t('navigation.register') || 'Register'}
                  </Button>
                </Link>
                <Link 
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button variant="brand" size="sm" className="w-full">
                    {t('nav.login') || t('navigation.login') || 'Login'}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header;