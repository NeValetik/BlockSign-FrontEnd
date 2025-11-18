"use client"

import { cn } from "@/utils/cn"
import { ComponentProps, FC } from "react"

const Card: FC<ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}

const CardHeader: FC<ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
}

const CardTitle: FC<ComponentProps<"h3">> = ({
  className,
  ...props
}) => {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
}

const CardDescription: FC<ComponentProps<"p">> = ({
  className,
  ...props
}) => {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

const CardContent: FC<ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  )
}

const CardFooter: FC<ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

