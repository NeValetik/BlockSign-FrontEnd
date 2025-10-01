'use client';

import { FC, useState } from "react";
import { useUserContext } from "@/contexts/userContext";

import Button from "@/components/Form/Button";
import LanguageSelector from "@/components/LanguageSelector";
import Link from "next/link";
import Profile from "@/components/Profile";
import { Menu, X, Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";

const Header:FC = () => {
  const { me } = useUserContext();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!me) {
    return (
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <Link
            href="/"
            className="text-xl sm:text-2xl md:text-3xl font-bold text-brand hover:text-brand/80 transition-colors"
          >
            BlockSign
          </Link>
          
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <LanguageSelector />
            <Link href="/register">
              <Button variant="ghost" size="sm">
                {t('navigation.register')}
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="brand" size="sm">
                {t('navigation.login')}
              </Button>
            </Link>
          </div>

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

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-6 space-y-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors">
                <Globe className="size-4" />
                <LanguageSelector />
              </div>
              
              <div className="space-y-2">
                <Link 
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    {t('navigation.register')}
                  </Button>
                </Link>
                <Link 
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button variant="brand" size="sm" className="w-full">
                    {t('navigation.login')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Link
          href="/"
          className="text-xl sm:text-2xl md:text-3xl font-bold text-brand hover:text-brand/80 transition-colors"
        >
          BlockSign
        </Link>
        
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <LanguageSelector />
          <Profile />
        </div>

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

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-6 space-y-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors">
              <LanguageSelector />
            </div>
            
            <div onClick={() => setIsMobileMenuOpen(false)}>
              <Profile />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header;