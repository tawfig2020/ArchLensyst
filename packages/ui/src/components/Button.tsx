import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-citadel text-sm font-medium transition-all sentinel-focus disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-sentinel-blue text-white hover:bg-sentinel-blue-hover shadow-sentinel',
        destructive: 'bg-breach-red text-white hover:bg-breach-red-hover',
        outline: 'border border-citadel-border bg-transparent hover:bg-citadel-elevated hover:text-white',
        secondary: 'bg-citadel-elevated text-gray-300 hover:bg-citadel-border hover:text-white',
        ghost: 'hover:bg-citadel-elevated hover:text-white',
        link: 'text-sentinel-blue underline-offset-4 hover:underline',
        success: 'bg-invariant-green text-white hover:bg-invariant-green-hover',
        warning: 'bg-caution-amber text-black hover:bg-caution-amber-hover',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-7 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-9 w-9',
        xs: 'h-6 rounded px-2 text-[10px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
