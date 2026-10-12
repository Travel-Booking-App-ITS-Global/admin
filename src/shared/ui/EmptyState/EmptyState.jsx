
/**
 * @typedef {Object} EmptyStateProps
 * @property {React.ReactNode} [icon] - Icon component to display
 * @property {string} title - Main empty state title
 * @property {string} [description] - Subtext or instructions
 * @property {React.ReactNode} [action] - Call to action button or component
 * @property {string} [className] - Additional CSS class name
 */

/**
 * Reusable EmptyState component for data-driven views
 * @param {EmptyStateProps} props
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div
      className={`empty-state-card ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-10) var(--space-6)',
        textAlign: 'center',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-default)',
        background: 'var(--bg-card)',
        margin: 'var(--space-4) 0',
      }}
    >
      {icon && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--brand-50)',
            color: 'var(--brand-600)',
            marginBottom: 'var(--space-4)',
          }}
        >
          {icon}
        </div>
      )}
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-1)',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            maxWidth: '400px',
            marginBottom: action ? 'var(--space-5)' : 0,
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
