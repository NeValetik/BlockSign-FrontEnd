'use client';

import { ArrowRight, Shield, CheckCircle, Lock, Users, Globe, Zap, Star, Award } from "lucide-react";

import Container from "@/components/Container";
import Button from "@/components/Form/Button";
import Image from "next/image";
import { useClientTranslation } from "@/hooks/useLocale";

const LandingPage = () => {
  const { t } = useClientTranslation();
  return (
    <Container className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16 lg:py-20 flex flex-col gap-16 sm:gap-20 md:gap-24 lg:gap-32 xl:gap-40 items-center">
      {/* Background with mobile optimization */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl h-full opacity-10">
          <Image 
            src="/static/bgsvg.svg" 
            alt="background pattern" 
            width={1200} 
            height={1000} 
            className="w-full h-full object-cover"
            priority
          />
        </div>
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80"></div>
      </div>
      
      {/* Hero Section - Mobile Optimized */}
      <div className="flex flex-col items-center text-center w-full max-w-4xl">
        {/* Trust Badge */}
        <div className="flex items-center gap-2 text-brand text-sm font-medium mb-6 px-4 py-2 bg-brand/10 rounded-full border border-brand/20">
          <Shield className="size-4" />
          <span>{t('landing.hero.badge')}</span>
          <Award className="size-4" />
        </div>
        
        {/* Main Headline */}
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6">
          {t('landing.hero.title')}
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
          {t('landing.hero.subtitle')}
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-none sm:w-auto mb-8">
            <Button
              variant="brand"
            size="lg"
            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold"
            >
            {t('landing.hero.cta.primary')}
            <ArrowRight className="ml-2" />
            </Button>
            <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto px-8 py-4 text-lg"
            >
            {t('landing.hero.cta.secondary')}
            </Button>
        </div>
        
        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-green-500" />
            <span>{t('landing.hero.trust.gdpr')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-green-500" />
            <span>{t('landing.hero.trust.eidas')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-green-500" />
            <span>{t('landing.hero.trust.noCard')}</span>
          </div>
        </div>
      </div>
      {/* Features Section - Mobile Optimized */}
      <div className="flex flex-col gap-12 sm:gap-16 items-center w-full">
        <div className="flex flex-col gap-4 sm:gap-6 items-center max-w-4xl w-full text-center">
          <div className="text-brand text-sm font-semibold uppercase tracking-wide">
            {t('landing.features.title')}
          </div>
          <h2 className="text-foreground font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
            {t('landing.features.subtitle')}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            {t('landing.features.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full max-w-7xl">
          {/* Feature 1 */}
          <div className="flex flex-col gap-4 sm:gap-6 p-6 sm:p-8 bg-card/50 rounded-2xl border border-border/50 hover:border-brand/30 transition-all duration-300">
            <div className="text-brand-foreground w-14 h-14 flex items-center justify-center bg-brand rounded-2xl shadow-lg">
              <Lock className="size-7"/>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-xl sm:text-2xl">
                {t('landing.features.crypto.title')}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {t('landing.features.crypto.description')}
              </p>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="flex flex-col gap-4 sm:gap-6 p-6 sm:p-8 bg-card/50 rounded-2xl border border-border/50 hover:border-brand/30 transition-all duration-300">
            <div className="text-brand-foreground w-14 h-14 flex items-center justify-center bg-brand rounded-2xl shadow-lg">
              <CheckCircle className="size-7"/>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-xl sm:text-2xl">
                {t('landing.features.verification.title')}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {t('landing.features.verification.description')}
              </p>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="flex flex-col gap-4 sm:gap-6 p-6 sm:p-8 bg-card/50 rounded-2xl border border-border/50 hover:border-brand/30 transition-all duration-300">
            <div className="text-brand-foreground w-14 h-14 flex items-center justify-center bg-brand rounded-2xl shadow-lg">
              <Shield className="size-7"/>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-xl sm:text-2xl">
                {t('landing.features.compliance.title')}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {t('landing.features.compliance.description')}
              </p>
            </div>
          </div>
          
          {/* Feature 4 */}
          <div className="flex flex-col gap-4 sm:gap-6 p-6 sm:p-8 bg-card/50 rounded-2xl border border-border/50 hover:border-brand/30 transition-all duration-300">
            <div className="text-brand-foreground w-14 h-14 flex items-center justify-center bg-brand rounded-2xl shadow-lg">
              <Users className="size-7"/>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-xl sm:text-2xl">
                {t('landing.features.workflows.title')}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {t('landing.features.workflows.description')}
              </p>
            </div>
          </div>
          
          {/* Feature 5 */}
          <div className="flex flex-col gap-4 sm:gap-6 p-6 sm:p-8 bg-card/50 rounded-2xl border border-border/50 hover:border-brand/30 transition-all duration-300">
            <div className="text-brand-foreground w-14 h-14 flex items-center justify-center bg-brand rounded-2xl shadow-lg">
              <Globe className="size-7"/>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-xl sm:text-2xl">
                {t('landing.features.global.title')}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {t('landing.features.global.description')}
              </p>
            </div>
          </div>
          
          {/* Feature 6 */}
          <div className="flex flex-col gap-4 sm:gap-6 p-6 sm:p-8 bg-card/50 rounded-2xl border border-border/50 hover:border-brand/30 transition-all duration-300">
            <div className="text-brand-foreground w-14 h-14 flex items-center justify-center bg-brand rounded-2xl shadow-lg">
              <Zap className="size-7"/>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-xl sm:text-2xl">
                {t('landing.features.security.title')}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {t('landing.features.security.description')}
              </p>
              </div>
                </div>
                </div>
              </div>
      
      {/* Testimonials Section */}
      <div className="flex flex-col gap-12 sm:gap-16 items-center w-full">
        <div className="flex flex-col gap-4 sm:gap-6 items-center max-w-4xl w-full text-center">
          <div className="text-brand text-sm font-semibold uppercase tracking-wide">
            {t('landing.testimonials.title')}
          </div>
          <h2 className="text-foreground font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
            {t('landing.testimonials.subtitle')}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            {t('landing.testimonials.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-6xl">
          {/* Testimonial 1 */}
          <div className="flex flex-col gap-4 p-6 sm:p-8 bg-card/50 rounded-2xl border border-border/50">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed italic">
              &ldquo;{t('landing.testimonials.testimonial1')}&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center">
                <span className="text-brand font-semibold text-sm">SM</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Sarah Mitchell</div>
                <div className="text-xs text-muted-foreground">Legal Director, TechCorp</div>
              </div>
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="flex flex-col gap-4 p-6 sm:p-8 bg-card/50 rounded-2xl border border-border/50">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed italic">
              &ldquo;{t('landing.testimonials.testimonial2')}&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center">
                <span className="text-brand font-semibold text-sm">MR</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Michael Rodriguez</div>
                <div className="text-xs text-muted-foreground">Compliance Officer, GlobalFinance</div>
              </div>
            </div>
          </div>
          
          {/* Testimonial 3 */}
          <div className="flex flex-col gap-4 p-6 sm:p-8 bg-card/50 rounded-2xl border border-border/50 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed italic">
              &ldquo;{t('landing.testimonials.testimonial3')}&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center">
                <span className="text-brand font-semibold text-sm">AJ</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Alex Johnson</div>
                <div className="text-xs text-muted-foreground">CEO, InnovateStart</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trust & Security Section */}
      <div className="flex flex-col gap-12 sm:gap-16 items-center w-full bg-gradient-to-br from-brand/5 via-muted/30 to-brand/5 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 border border-brand/10">
        <div className="flex flex-col gap-4 sm:gap-6 items-center max-w-4xl w-full text-center">
          <div className="text-brand text-sm font-semibold uppercase tracking-wide">
            {t('landing.stats.title')}
          </div>
          <h2 className="text-foreground font-bold text-2xl sm:text-3xl md:text-4xl leading-tight">
            {t('landing.stats.subtitle')}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            {t('landing.stats.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-5xl">
          <div className="flex flex-col items-center gap-3 text-center p-6 bg-card/50 rounded-2xl border border-border/50">
            <div className="text-3xl sm:text-4xl font-bold text-brand">50,000+</div>
            <div className="text-muted-foreground font-medium">{t('landing.stats.documents')}</div>
            <div className="text-xs text-muted-foreground">Across 30+ countries</div>
          </div>
          <div className="flex flex-col items-center gap-3 text-center p-6 bg-card/50 rounded-2xl border border-border/50">
            <div className="text-3xl sm:text-4xl font-bold text-brand">99.9%</div>
            <div className="text-muted-foreground font-medium">{t('landing.stats.uptime')}</div>
            <div className="text-xs text-muted-foreground">Enterprise SLA</div>
          </div>
          <div className="flex flex-col items-center gap-3 text-center p-6 bg-card/50 rounded-2xl border border-border/50">
            <div className="text-3xl sm:text-4xl font-bold text-brand">24/7</div>
            <div className="text-muted-foreground font-medium">{t('landing.stats.monitoring')}</div>
            <div className="text-xs text-muted-foreground">Real-time protection</div>
          </div>
          <div className="flex flex-col items-center gap-3 text-center p-6 bg-card/50 rounded-2xl border border-border/50">
            <div className="text-3xl sm:text-4xl font-bold text-brand">100%</div>
            <div className="text-muted-foreground font-medium">{t('landing.stats.gdpr')}</div>
            <div className="text-xs text-muted-foreground">Privacy by design</div>
          </div>
        </div>
        
        {/* Security Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-full">
            <CheckCircle className="size-5 text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">{t('landing.stats.badges.soc2')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <Shield className="size-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">{t('landing.stats.badges.iso')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
            <Award className="size-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">{t('landing.stats.badges.eidas')}</span>
          </div>
        </div>
      </div>
      
      {/* Pricing Section */}
      <div className="flex flex-col gap-12 sm:gap-16 items-center w-full">
        <div className="flex flex-col gap-4 sm:gap-6 items-center max-w-4xl w-full text-center">
          <div className="text-brand text-sm font-semibold uppercase tracking-wide">
            {t('landing.pricing.title')}
          </div>
          <h2 className="text-foreground font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
            {t('landing.pricing.subtitle')}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            {t('landing.pricing.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl">
          {/* Starter Plan */}
          <div className="flex flex-col gap-6 p-6 sm:p-8 bg-card/50 rounded-2xl border border-border/50 hover:border-brand/30 transition-all duration-300">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-xl">Starter</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">Free</span>
                <span className="text-muted-foreground">forever</span>
              </div>
              <p className="text-sm text-muted-foreground">Perfect for individuals and small teams</p>
            </div>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-500" />
                <span>Up to 10 documents/month</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-500" />
                <span>Blockchain verification</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-500" />
                <span>Basic multi-party workflows</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-500" />
                <span>Email support</span>
              </li>
            </ul>
            <Button variant="outline" size="lg" className="w-full mt-auto">
              Get Started Free
            </Button>
          </div>
          
          {/* Professional Plan */}
          <div className="flex flex-col gap-6 p-6 sm:p-8 bg-gradient-to-br from-brand/5 to-brand/10 rounded-2xl border-2 border-brand/30 hover:border-brand/50 transition-all duration-300 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-brand text-brand-foreground px-4 py-1 rounded-full text-xs font-semibold">
                Most Popular
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-xl">Professional</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">Ideal for growing businesses</p>
            </div>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-500" />
                <span>Up to 500 documents/month</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-500" />
                <span>Advanced workflows</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-500" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-500" />
                <span>API access</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-500" />
                <span>Custom branding</span>
              </li>
            </ul>
            <Button variant="brand" size="lg" className="w-full mt-auto">
              Start Free Trial
            </Button>
          </div>
          
          {/* Enterprise Plan */}
          <div className="flex flex-col gap-6 p-6 sm:p-8 bg-card/50 rounded-2xl border border-border/50 hover:border-brand/30 transition-all duration-300">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-xl">Enterprise</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">Custom</span>
              </div>
              <p className="text-sm text-muted-foreground">For large organizations</p>
            </div>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-500" />
                <span>Unlimited documents</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-500" />
                <span>White-label solution</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-500" />
                <span>Dedicated support</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-500" />
                <span>On-premise deployment</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-500" />
                <span>SLA guarantee</span>
              </li>
            </ul>
            <Button variant="outline" size="lg" className="w-full mt-auto">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
      
      {/* Final CTA Section */}
      <div className="flex flex-col gap-8 items-center max-w-4xl w-full text-center">
        <div className="flex flex-col gap-6">
          <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
            Ready to Secure Your Documents?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Join thousands of organizations already using BlockSign to protect their most critical documents. 
            Start your free trial today and experience the future of document security.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Button variant="brand" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold">
            Start Free Trial
            <ArrowRight className="ml-2" />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
            Schedule Demo
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-green-500" />
            <span>30-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-green-500" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default LandingPage;
