import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'ghost' | 'quiet'
export type ButtonSize = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-mono text-[0.8125rem] tracking-[0.08em] uppercase whitespace-nowrap transition-colors duration-150 ease-[var(--ease-enter)] select-none'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-canvas hover:bg-ink border border-transparent',
  ghost: 'border border-edge-control text-ink hover:border-accent hover:text-accent bg-transparent',
  quiet:
    'border border-edge-control text-ink-2 hover:text-ink hover:border-edge-strong bg-transparent',
}

const sizes: Record<ButtonSize, string> = {
  md: 'h-11 px-5',
  lg: 'h-14 px-7 text-sm',
}

/** Shared class string so the magnetic variant and the plain one never drift. */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  extra?: string,
): string {
  return cn(base, variants[variant], sizes[size], extra)
}

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  className?: string
}

type AnchorProps = CommonProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'className' | 'children'
  >

type NativeProps = CommonProps & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'children'
  >

export function Button(props: AnchorProps | NativeProps) {
  const { variant = 'primary', size = 'md', className, children } = props

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props
    return (
      <a href={href} className={buttonClasses(variant, size, className)} {...rest}>
        {children}
      </a>
    )
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  )
}
