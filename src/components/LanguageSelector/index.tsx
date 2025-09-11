'use client'

import { ChevronDown, Globe } from "lucide-react"
import { useLocale } from "@/contexts/localeContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../Form/DropDown";

const LanguageSelector = () => {
  const { locales, setLocale, current } = useLocale();
  const handleChangeLocale = (local: string) => {
    setLocale(local);
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2 cursor-pointer">
          <Globe className="w-4 h-4" />
          <span>{ current.label }</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        { locales.map((locale) => {
          return (
            <DropdownMenuItem 
              key={locale.key}
              onClick={() => { handleChangeLocale(locale.key) }}
              className="cursor-pointer"
            >
              {locale.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSelector;