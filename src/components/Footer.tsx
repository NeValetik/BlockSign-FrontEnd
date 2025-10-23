import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2025 Blocksign. All rights reserved.
          </div>
          <a
            href="mailto:contact@blocksign.md"
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>contact@blocksign.md</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
