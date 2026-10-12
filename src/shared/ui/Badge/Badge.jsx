
/**
 * @typedef {'primary' | 'success' | 'warning' | 'danger' | 'neutral'} BadgeVariant
 * @typedef {'sm' | 'md' | 'lg'} BadgeSize
 *
 * @typedef {Object} BadgeProps
 * @property {React.ReactNode} children - Badge content
 * @property {BadgeVariant} [variant] - Visual variant
 * @property {BadgeSize} [size] - Badge size
 * @property {React.ReactNode} [icon] - Optional leading icon
 * @property {string} [className] - Additional classes
 */

/**
 * Accessible Badge primitive for statuses and tags
 * @param {BadgeProps} props
 */
export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) {
  const variantStyles = {
    primary: { background: 'var(--brand-50)', color: 'var(--brand-700)', border: '1px solid var(--brand-200)' },
    success: { background: 'var(--success-50)', color: 'var(--success-600)', border: '1px solid var(--success-400)' },
    warning: { background: 'var(--warning-50)', color: 'var(--warning-600)', border: '1px solid var(--warning-400)' },
    danger:  { background: 'var(--danger-50)', color: 'var(--danger-600)', border: '1px solid var(--danger-400)' },
    neutral: { background: 'var(--gray-100)', color: 'var(--gray-700)', border: '1px solid var(--gray-300)' },
  };

  const sizeStyles = {
    sm: { padding: '2px 6px', fontSize: '0.75rem', gap: '4px' },
    md: { padding: '4px 10px', fontSize: '0.8125rem', gap: '6px' },
    lg: { padding: '6px 14px', fontSize: '0.875rem', gap: '8px' },
  };

  const currentVariant = variantStyles[variant] || variantStyles.neutral;
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      className={`ui-badge ui-badge-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: 500,
        borderRadius: 'var(--radius-full)',
        lineHeight: 1,
        ...currentVariant,
        ...currentSize,
      }}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
