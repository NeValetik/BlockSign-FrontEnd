"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/utils/cn"
import Link from "next/link"

type TabsTriggerProps = 
  | (React.ComponentProps<typeof TabsPrimitive.Trigger> & { href?: never, isActiveValue?: never })
  | (Omit<React.ComponentProps<typeof TabsPrimitive.Trigger>, 'value'> & { href: string; isActiveValue: boolean })

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  className,
  href,
  children,
  isActiveValue,
  ...props
}) => {
  if (href) {
    return (
      <Link 
        data-slot="tabs-trigger"
        href={href}
        data-state={isActiveValue && "active"}
        className={cn(
          "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
      >
        {children}
      </Link>
    )
  }
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...(props as React.ComponentProps<typeof TabsPrimitive.Trigger>)}
    >
      {children}
    </TabsPrimitive.Trigger>
  )
}

export { TabsTrigger }
