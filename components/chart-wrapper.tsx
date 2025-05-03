"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ChartWrapperProps {
  title: string
  description?: string
  className?: string
  isLoading?: boolean
  children: ReactNode
  action?: ReactNode
}

export function ChartWrapper({
  title,
  description,
  className,
  isLoading = false,
  children,
  action,
}: ChartWrapperProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {action && <div className="flex items-center">{action}</div>}
      </CardHeader>
      <CardContent className={cn("p-0", isLoading ? "flex items-center justify-center py-6" : "")}>
        {isLoading ? (
          <div className="w-full space-y-2">
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
