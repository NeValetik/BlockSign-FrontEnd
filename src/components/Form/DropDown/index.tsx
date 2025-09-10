"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { ComponentProps, FC } from "react"

// Import components
import DropdownMenuTrigger from "./components/DropdownMenuTrigger"
import DropdownMenuContent from "./components/DropdownMenuContent"
import DropdownMenuPortal from "./components/DropdownMenuPortal"
import DropdownMenuItem from "./components/DropdownMenuItem"
import DropdownMenuCheckboxItem from "./components/DropdownMenuCheckboxItem"
import DropdownMenuRadioItem from "./components/DropdownMenuRadioItem"
import DropdownMenuGroup from "./components/DropdownMenuGroup"
import DropdownMenuRadioGroup from "./components/DropdownMenuRadioGroup"
import DropdownMenuLabel from "./components/DropdownMenuLabel"
import DropdownMenuSub from "./components/DropdownMenuSub"
import DropdownMenuSubTrigger from "./components/DropdownMenuSubTrigger"
import DropdownMenuSubContent from "./components/DropdownMenuSubContent"
import DropdownMenuSeparator from "./components/DropdownMenuSeparator"
import DropdownMenuShortcut from "./components/DropdownMenuShortcut"

const DropdownMenu: FC<ComponentProps<typeof DropdownMenuPrimitive.Root>> = ({
  ...props
}) => {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
