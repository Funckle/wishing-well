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
      'btn-organic inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'

    const variantClasses = {
      primary:
        'bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-terracotta)] text-white hover:from-[var(--color-coral-deep)] hover:to-[var(--color-terracotta-deep)] focus-visible:ring-[var(--color-coral)] shadow-lg',
      secondary:
        'bg-gradient-to-br from-[var(--color-honey)] to-[var(--color-amber)] text-white hover:from-[var(--color-amber)] hover:to-[var(--color-gold)] focus-visible:ring-[var(--color-honey)] shadow-lg',
      outline:
        'border-2 border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--color-sand)] hover:border-[var(--color-clay)] focus-visible:ring-[var(--color-terracotta)] bg-[var(--bg-card)]',
      ghost:
        'text-[var(--text-secondary)] hover:bg-[var(--color-sand)] hover:text-[var(--text-primary)] focus-visible:ring-[var(--color-terracotta)]',
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
        whileHover={disabled || isLoading ? {} : { scale: 1.02, y: -1 }}
        whileTap={disabled || isLoading ? {} : { scale: 0.98, y: 0 }}
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
