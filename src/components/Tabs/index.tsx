"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/utils/cn"
import { TabsList } from "@/components/Tabs/components/TabsList"
import { TabsTrigger } from "@/components/Tabs/components/TabsTrigger"
import { TabsContent } from "@/components/Tabs/components/TabsContent"

const Tabs = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) => {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
