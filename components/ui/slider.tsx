import * as React from "react"
import { cn } from "@/lib/utils"

const SliderTrack = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("relative h-2 w-full grow overflow-hidden rounded-full bg-secondary/50", className)}
      {...props}
    />
  ),
)
SliderTrack.displayName = "SliderTrack"

const SliderRange = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("absolute h-full bg-primary", className)} {...props} />
  ),
)
SliderRange.displayName = "SliderRange"

const SliderThumb = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "block h-5 w-5 rounded-full bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
)
SliderThumb.displayName = "SliderThumb"

export { SliderTrack, SliderRange, SliderThumb }
