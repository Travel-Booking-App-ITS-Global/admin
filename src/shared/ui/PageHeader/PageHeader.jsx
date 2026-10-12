
/**
 * @typedef {Object} PageHeaderProps
 * @property {string} title - Page title
 * @property {string} [subtitle] - Page subtitle or description
 * @property {React.ReactNode} [actions] - Action buttons or controls
 * @property {React.ReactNode} [breadcrumbs] - Breadcrumb navigation
 * @property {string} [className] - Optional custom class name
 */

/**
 * Standard PageHeader primitive for Admin pages
 * @param {PageHeaderProps} props
 */
export function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumbs,
  className = '',
}) {
  return (
    <div
      className={`page-header-container ${className}`}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}
    >
      <div>
        {breadcrumbs && <div style={{ marginBottom: 'var(--space-1)' }}>{breadcrumbs}</div>}
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginTop: 'var(--space-1)',
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
          }}
        >
          {actions}
        </div>
      )}
    </div>
  );
}
