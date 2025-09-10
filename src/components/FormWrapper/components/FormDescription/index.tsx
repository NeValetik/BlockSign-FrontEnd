"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import useFormField from "../../hooks/useFormField"

const FormDescription = ({ className, ...props }: React.ComponentProps<"p">) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export default FormDescription;
