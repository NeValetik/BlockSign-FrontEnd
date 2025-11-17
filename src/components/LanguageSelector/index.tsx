'use client'

import { Globe } from "lucide-react"
import { useLocale } from "@/contexts/LocaleContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../Form/DropDown";

const LanguageSelector = () => {
  const { locales, setLocale, current } = useLocale();
  const handleChangeLocale = (local: string) => {
    setLocale(local);
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hover:bg-accent rounded-md p-2.5 transition-colors duration-200">
        <div className="group flex items-center gap-2 cursor-pointer ">
          <Globe className="size-4" />
          {/* <ChevronDown 
            className="
              size-4 
              group-data-[state=open]:-rotate-180 transition-transform 
              duration-200
            " 
          /> */}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        { locales.map((locale) => {
          return (
            <DropdownMenuItem 
              key={locale.key}
              onClick={() => { handleChangeLocale(locale.key) }}
              data-active={current.key === locale.key}
              className="cursor-pointer data-[active=true]:bg-accent"
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