'use client';

import { FC, useMemo } from "react";
import { Mail } from "lucide-react";

const Footer: FC = () => {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="border-t bg-muted/50">
      <div className="py-8 mx-24">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            {`© ${year} Blocksign. All rights reserved.`}
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

export default Footer;