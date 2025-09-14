'use client'

import { ArrowRight, FileInput } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "../../lib/i18n/client";

import Container from "@/components/Container";
import Button from "@/components/Form/Button";
import Image from "next/image";

const LandingPage = () => {
  const { locale } = useLocale();
  const { t } = useTranslation( locale, [ 'landing' ] );

  return (
    <Container className="relative px-36 py-20 flex flex-col gap-48 items-center">
      <div className="absolute w-[1248px] h-[1000px] scale-110 -z-10">
        <Image src="/static/bgsvg.svg" alt="bg" width={1200} height={1000} className="size-full min-w-[1200px] min-h-[1000px]"/>
      </div>
      <div className="flex flex-col my-24 gap-36 w-full">
        <span
          className="text-5xl"
        >
          {t('landing.title')}
        </span>
        <div className="max-w-[840px] w-full flex flex-col gap-8">
          <span
            className="font-bold text-6xl"
          >
            {t('hero.title')}
          </span>
          <span
            className="text-xl text-muted-foreground"
          >
            {t('hero.description')}
          </span>
          <div
            className="flex gap-4"
          >
            <Button
              variant="brand"
            >
              {t('hero.getStarted')}
            </Button>
            <Button
              variant="ghost"
            >
              {t('hero.learnMore')}
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col gap-16 items-center w-full"
      >
        <div className="flex flex-col gap items-center max-w-[800px] w-full text-center">
          <span className="text-brand text-base">
            {t('features.tagline')}
          </span>
          <span className="text-foreground font-bold text-5xl max-w-[500px] w-full">
            {t('features.title')}
          </span>
          <span className="text-3xl text-muted-foreground ">
            {t('features.description')}
          </span>
        </div>
        <div className="flex flex-col gap-16 items-center w-full">
          <div className="flex justify-around w-full">
            <div
              className="flex gap-8"
            >
              <div className="text-brand-foreground w-10 h-10 flex items-center justify-center bg-brand rounded-[8px]">
                <FileInput className="size-6"/>
              </div>
              <div className="flex flex-col gap-2 max-w-[300px]">
                <div
                  className="font-bold text-2xl"
                >
                  {t('features.uploadFiles.title')}
                </div>
                <div
                  className="text-accent-foreground text-base w-full"
                >
                  {t('features.uploadFiles.description')}
                </div>
              </div>
            </div>
            <div
              className="flex gap-8"
            >
              <div className="text-brand-foreground w-10 h-10 flex items-center justify-center bg-brand rounded-[8px]">
                <FileInput className="size-6"/>
              </div>
              <div className="flex flex-col gap-2 max-w-[300px]">
                <div
                  className="font-bold text-2xl"
                >
                  {t('features.uploadFiles.title')}
                </div>
                <div
                  className="text-accent-foreground text-base w-full"
                >
                  {t('features.uploadFiles.description')}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-around w-full">
            <div
              className="flex gap-8"
            >
              <div className="text-brand-foreground w-10 h-10 flex items-center justify-center bg-brand rounded-[8px]">
                <FileInput className="size-6"/>
              </div>
              <div className="flex flex-col gap-2 max-w-[300px]">
                <div
                  className="font-bold text-2xl"
                >
                  {t('features.uploadFiles.title')}
                </div>
                <div
                  className="text-accent-foreground text-base w-full"
                >
                  {t('features.uploadFiles.description')}
                </div>
              </div>
            </div>
            <div
              className="flex gap-8"
            >
              <div className="text-brand-foreground w-10 h-10 flex items-center justify-center bg-brand rounded-[8px]">
                <FileInput className="size-6"/>
              </div>
              <div className="flex flex-col gap-2 max-w-[300px]">
                <div
                  className="font-bold text-2xl"
                >
                  {t('features.uploadFiles.title')}
                </div>
                <div
                  className="text-accent-foreground text-base w-full"
                >
                  {t('features.uploadFiles.description')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col gap-8 items-center max-w-[840px] w-full" 
      >
        <div className="flex flex-col gap-6 text-center">
          <div className="font-bold text-6xl">
            {t('cta.title')}
          </div>
          <div className="text-muted-foreground text-xl">
            {t('cta.description')}
          </div>
        </div>
        <div className="flex justify-center gap-8">
          <Button variant="brand">
            {t('cta.getStarted')}
          </Button>
          <Button
            variant="ghost"
          >
            {t('cta.learnMore')}
            <ArrowRight />
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default LandingPage;
