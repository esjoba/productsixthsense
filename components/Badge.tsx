interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'accent' | 'destructive'
  className?: string
}

const variants = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent text-white',
  destructive: 'bg-destructive text-white',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
