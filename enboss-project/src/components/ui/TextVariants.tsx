import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium ring-offset-background transition-colors",
  {
    variants: {
      variant: {
        default: "bg-black/5 text-brand-900 dark:bg-btn-dark/50",
        primary: "bg-btn text-white dark:bg-btn-dark dark:text-black",
        success: "bg-success/10 dark:bg-success-dark/15 text-success dark:text-success-dark",
        brand: "bg-brand-main/10 dark:bg-brand-dark/15 text-brand-main dark:text-brand-dark",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        info: "bg-info/10 dark:bg-info-dark/10 text-info dark:text-info-dark",
        destructive: "bg-destructive/80 text-destructive-foreground",
        outline: "bord bg-btn-secondary dark:bg-btn-secondary-dark",
        secondary: "bg-btn text-text dark:bg-btn-dark",
        ghost: "text-text-secondary-dark/50 dark:text-text-secondary/50 bg-black/5 dark:bg-white/[2.5%]",
        link: "text-primary underline-offset-4 hover:underline",
        error: "bg-error/10 dark:bg-error-dark/15 text-error dark:text-error-dark",
      },
      size: {
        default: "text-xs px-2.5 py-0.5",
        sm: "text-[10px] px-2 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface TextBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof textBadgeVariants> {
  children: React.ReactNode
}

const TextBadge = React.forwardRef<HTMLSpanElement, TextBadgeProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <span
        className={cn(textBadgeVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    )
  }
)

TextBadge.displayName = "TextBadge"

export { TextBadge, textBadgeVariants } 