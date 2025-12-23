import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-white shadow-soft hover:shadow-lifted",
        outline:
          "border border-foreground bg-transparent text-foreground hover:text-white",
        ghost: "hover:bg-muted text-foreground",
        link: "text-foreground underline-offset-4 hover:underline decoration-accent decoration-2",
      },
      size: {
        default: "h-12 px-8",
        sm: "h-10 px-6",
        lg: "h-14 px-10 text-sm",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Gold overlay animation for default variant */}
        {variant === 'default' && (
          <span className="absolute inset-0 translate-x-[-101%] bg-accent transition-transform duration-500 ease-luxury group-hover:translate-x-0" />
        )}

        {/* Dark overlay animation for outline variant */}
        {variant === 'outline' && (
          <span className="absolute inset-0 translate-x-[-101%] bg-foreground transition-transform duration-500 ease-luxury group-hover:translate-x-0" />
        )}

        {/* Content z-index ensures visibility over overlays */}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
