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
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            error
              ? 'border-red-300 focus:ring-red-400 focus:border-red-400'
              : 'border-stone-200 focus:ring-rose-400 focus:border-rose-400 hover:border-stone-300'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-stone-500">{helperText}</p>
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
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            value={value}
            maxLength={maxLength}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-none ${
              error
                ? 'border-red-300 focus:ring-red-400 focus:border-red-400'
                : 'border-stone-200 focus:ring-rose-400 focus:border-rose-400 hover:border-stone-300'
            } ${className}`}
            {...props}
          />
          {showCount && maxLength && (
            <span
              className={`absolute bottom-2 right-3 text-xs ${
                currentLength > maxLength * 0.9 ? 'text-amber-500' : 'text-stone-400'
              }`}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-stone-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
