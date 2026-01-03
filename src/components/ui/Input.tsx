'use client'

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-organic w-full px-4 py-3 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-faded)] focus:outline-none ${
            error
              ? 'border-[var(--color-coral)] focus:border-[var(--color-coral-deep)] focus:ring-2 focus:ring-[var(--color-coral)]/20'
              : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-[var(--color-coral)]">{error}</p>}
        {helperText && !error && (
          <p className="mt-2 text-sm text-[var(--text-muted)]">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  maxLength?: number
  showCount?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, maxLength, showCount = false, className = '', value, ...props }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            value={value}
            maxLength={maxLength}
            className={`input-organic w-full px-4 py-3 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-faded)] resize-none focus:outline-none ${
              error
                ? 'border-[var(--color-coral)] focus:border-[var(--color-coral-deep)] focus:ring-2 focus:ring-[var(--color-coral)]/20'
                : ''
            } ${className}`}
            {...props}
          />
          {showCount && maxLength && (
            <span
              className={`absolute bottom-3 right-3 text-xs ${
                currentLength > maxLength * 0.9 ? 'text-[var(--color-coral)]' : 'text-[var(--text-faded)]'
              }`}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-[var(--color-coral)]">{error}</p>}
        {helperText && !error && (
          <p className="mt-2 text-sm text-[var(--text-muted)]">{helperText}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
