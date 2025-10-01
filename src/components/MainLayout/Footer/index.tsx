'use client';

import { FC, useMemo } from "react";
import { Github, Twitter, Linkedin, Shield, Award, CheckCircle } from "lucide-react";
import Container from "../../Container";
import Link from "next/link";

const Footer: FC = () => {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="bg-muted/30 border-t border-border">
      <Container className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20">
        {/* Desktop Footer */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-brand mb-4">BlockSign</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Secure your documents with blockchain-powered notarization. 
                  Enterprise-grade security meets user-friendly design for organizations worldwide.
                </p>
                <div className="flex items-center gap-4">
                  <a href="#" className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="Twitter">
                    <Twitter className="size-5" />
                  </a>
                  <a href="#" className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="LinkedIn">
                    <Linkedin className="size-5" />
                  </a>
                  <a href="#" className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="GitHub">
                    <Github className="size-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/security" className="text-muted-foreground hover:text-foreground transition-colors">Security</Link></li>
                <li><Link href="/api" className="text-muted-foreground hover:text-foreground transition-colors">API</Link></li>
                <li><Link href="/integrations" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</Link></li>
              </ul>
                </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/press" className="text-muted-foreground hover:text-foreground transition-colors">Press</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
              </div>

            {/* Legal & Support */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal & Support</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/gdpr" className="text-muted-foreground hover:text-foreground transition-colors">GDPR Compliance</Link></li>
                <li><Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">Support Center</Link></li>
                <li><Link href="/status" className="text-muted-foreground hover:text-foreground transition-colors">System Status</Link></li>
              </ul>
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex items-center justify-between py-8 border-t border-border">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Shield className="size-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Award className="size-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">ISO 27001</span>
            </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <CheckCircle className="size-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">eIDAS Certified</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              © {year} BlockSign. All rights reserved.
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="lg:hidden">
          <div className="space-y-8 mb-8">
            {/* Company Info */}
        <div>
              <h3 className="text-xl font-bold text-brand mb-3">BlockSign</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Secure your documents with blockchain-powered notarization. 
                Enterprise-grade security meets user-friendly design.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="Twitter">
                  <Twitter className="size-5" />
                </a>
                <a href="#" className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="LinkedIn">
                  <Linkedin className="size-5" />
                </a>
                <a href="#" className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="GitHub">
                  <Github className="size-5" />
                </a>
              </div>
            </div>

            {/* Mobile Links Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                  <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                  <li><Link href="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                  <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                  <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
                  <li><Link href="/gdpr" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GDPR</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <ul className="space-y-2">
                  <li><Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
                  <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                  <li><Link href="/status" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Status</Link></li>
                </ul>
          </div>
            </div>
          </div>

          {/* Mobile Security Badges */}
          <div className="space-y-4 py-6 border-t border-border">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Shield className="size-4 text-green-600" />
                <span className="text-xs font-medium text-green-800 dark:text-green-200">SOC 2</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Award className="size-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-800 dark:text-blue-200">ISO 27001</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <CheckCircle className="size-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-800 dark:text-purple-200">eIDAS</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              © {year} BlockSign. All rights reserved.
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;