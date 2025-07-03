import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-trust-blue text-white shadow-soft hover:bg-blue-600 active:scale-95",
        destructive: "bg-risk-high text-white shadow-soft hover:bg-red-600 active:scale-95",
        outline: "border-2 border-trust-blue text-trust-blue bg-transparent hover:bg-trust-blue hover:text-white",
        secondary: "bg-health-teal text-white shadow-soft hover:bg-teal-600 active:scale-95",
        ghost: "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
        link: "text-trust-blue underline-offset-4 hover:underline",
        success: "bg-risk-low text-white shadow-soft hover:bg-green-600 active:scale-95",
        warning: "bg-alert-orange text-white shadow-soft hover:bg-orange-600 active:scale-95",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-lg",
        xl: "h-16 px-10 py-5 text-xl",
        icon: "h-12 w-12",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-14 w-14",
        full: "w-full h-14 px-8 py-4 text-lg", // Full-width action button
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton, buttonVariants } 