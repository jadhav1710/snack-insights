"use client"

import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react"

type KPIStatus = "positive" | "neutral" | "negative"

interface KPIChipProps {
  title: string
  value: string | number
  change?: number
  status?: KPIStatus
  icon?: ReactNode
  isLoading?: boolean
  className?: string
}

export function KPIChip({
  title,
  value,
  change,
  status = "neutral",
  icon,
  isLoading = false,
  className,
}: KPIChipProps) {
  const statusClasses = {
    positive: "bg-[#28A745]/10 text-[#28A745] border-[#28A745]/20",
    neutral: "bg-[#FF671F]/10 text-[#FF671F] border-[#FF671F]/20",
    negative: "bg-[#E0245E]/10 text-[#E0245E] border-[#E0245E]/20",
  }

  const changeIcon = {
    positive: <ArrowUpIcon className="h-3 w-3 text-[#28A745]" />,
    neutral: <MinusIcon className="h-3 w-3 text-[#FF671F]" />,
    negative: <ArrowDownIcon className="h-3 w-3 text-[#E0245E]" />,
  }

  if (isLoading) {
    return (
      <Card className={cn("border shadow-sm", className)}>
        <CardContent className="p-4">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("border shadow-sm transition-all hover:shadow-md", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="mt-1">
          <p className="text-2xl font-bold">{value}</p>
          {typeof change !== "undefined" && (
            <div className={cn("mt-1 flex items-center text-xs font-medium", statusClasses[status])}>
              <span className="flex items-center">
                {changeIcon[status]}
                <span className="ml-1">{Math.abs(change)}%</span>
              </span>
              <span className="ml-1">vs. prev period</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
