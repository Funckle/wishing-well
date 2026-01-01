'use client'

import { motion } from 'framer-motion'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  icon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
      primary:
        'bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 focus:ring-pink-400 shadow-lg shadow-pink-200',
      secondary:
        'bg-gradient-to-r from-amber-400 to-yellow-500 text-white hover:from-amber-500 hover:to-yellow-600 focus:ring-yellow-400 shadow-lg shadow-yellow-200',
      outline:
        'border-2 border-stone-300 text-stone-700 hover:bg-stone-50 focus:ring-stone-400',
      ghost:
        'text-stone-600 hover:bg-stone-100 focus:ring-stone-400',
    }

    const sizeClasses = {
      sm: 'text-sm px-4 py-2 gap-1.5',
      md: 'text-base px-6 py-3 gap-2',
      lg: 'text-lg px-8 py-4 gap-2.5',
    }

    return (
      <motion.button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={disabled || isLoading}
        whileHover={disabled || isLoading ? {} : { scale: 1.02 }}
        whileTap={disabled || isLoading ? {} : { scale: 0.98 }}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {isLoading ? (
          <motion.span
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : icon ? (
          <span className="text-lg">{icon}</span>
        ) : null}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
