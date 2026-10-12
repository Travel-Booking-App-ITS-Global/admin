
/**
 * @typedef {Object} SkeletonProps
 * @property {string} [width] - Width of the skeleton item (e.g. '100%', '200px')
 * @property {string} [height] - Height of the skeleton item (e.g. '20px', '40px')
 * @property {string} [borderRadius] - Border radius (e.g. 'var(--radius-md)', '50%')
 * @property {string} [className] - Additional CSS classes
 * @property {React.CSSProperties} [style] - Inline CSS overrides
 * @property {number} [count] - Number of skeleton rows to render
 */

/**
 * Accessible Skeleton loader for data-driven loading states
 * @param {SkeletonProps} props
 */
export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-md)',
  className = '',
  style = {},
  count = 1,
}) {
  const items = Array.from({ length: count });

  return (
    <div className={`skeleton-container ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {items.map((_, index) => (
        <div
          key={index}
          className="skeleton-pulse"
          style={{
            width,
            height,
            borderRadius,
            backgroundColor: 'var(--gray-200)',
            backgroundImage: 'linear-gradient(90deg, var(--gray-200) 0%, var(--gray-100) 50%, var(--gray-200) 100%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.5s infinite linear',
            ...style,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
