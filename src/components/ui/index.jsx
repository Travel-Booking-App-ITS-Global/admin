/* Badge, StatusBadge, and KPI Card components */

export function Badge({ children, variant = 'gray' }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

const STATUS_MAP = {
  active:      { label: 'Active',      variant: 'success' },
  inactive:    { label: 'Inactive',    variant: 'gray'    },
  blocked:     { label: 'Blocked',     variant: 'danger'  },
  confirmed:   { label: 'Confirmed',   variant: 'success' },
  pending:     { label: 'Pending',     variant: 'warning' },
  cancelled:   { label: 'Cancelled',   variant: 'danger'  },
  refunded:    { label: 'Refunded',    variant: 'accent'  },
  completed:   { label: 'Completed',   variant: 'success' },
  ongoing:     { label: 'Ongoing',     variant: 'brand'   },
  scheduled:   { label: 'Scheduled',   variant: 'brand'   },
  open:        { label: 'Open',        variant: 'danger'  },
  in_progress: { label: 'In Progress', variant: 'warning' },
  resolved:    { label: 'Resolved',    variant: 'success' },
  draft:       { label: 'Draft',       variant: 'gray'    },
  published:   { label: 'Published',   variant: 'success' },
  shared:      { label: 'Shared',      variant: 'brand'   },
  success:     { label: 'Success',     variant: 'success' },
  warning:     { label: 'Warning',     variant: 'warning' },
  busy:        { label: 'Busy',        variant: 'warning' },
  high:        { label: 'High',        variant: 'danger'  },
  medium:      { label: 'Medium',      variant: 'warning' },
  low:         { label: 'Low',         variant: 'gray'    },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] || { label: status, variant: 'gray' };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export function KpiCard({ label, value, change, up, icon: Icon, iconBg }) {
  return (
    <div className="kpi-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div className="kpi-label">{label}</div>
          <div className="kpi-value">{value}</div>
        </div>
        {Icon && (
          <div className="kpi-icon-wrap" style={{ 
            background: `linear-gradient(135deg, ${iconBg}18, ${iconBg}08)`, 
            border: `1px solid ${iconBg}25`,
            boxShadow: `0 8px 20px -4px ${iconBg}35`
          }}>
            <Icon size={20} style={{ color: iconBg }} />
          </div>
        )}
      </div>
      {change && (
        <div className={`kpi-change ${up ? 'positive' : 'negative'}`}>
          <span className="kpi-change-arrow">{up ? '↗' : '↘'}</span>
          <span className="kpi-change-text">
            <strong>{change}</strong> vs last month
          </span>
        </div>
      )}
    </div>
  );
}

export function Avatar({ name = '', size = 'md', bg, src }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  const colors = ['#3b82f6','#8b5cf6','#22c55e','#f59e0b','#ef4444','#06b6d4','#ec4899'];
  const color = bg || colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`avatar avatar-${size}`} style={{ background: src ? 'transparent' : color, color: '#fff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {src ? (
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        initials
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      {Icon && <Icon className="empty-state-icon" size={56} />}
      <div className="empty-state-title">{title}</div>
      {description && <p className="empty-state-desc">{description}</p>}
      {action}
    </div>
  );
}

export function SkeletonRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <div className="skeleton" style={{ height: 14, width: i === 0 ? '120px' : '80px', borderRadius: 4 }} />
        </td>
      ))}
    </tr>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="section-header">
      <div>
        <h1 className="section-title">{title}</h1>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </div>
  );
}

export function TableFilters({ search, onSearch, children }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ position: 'relative', flex: '1', minWidth: 200, maxWidth: 320 }}>
        <input
          className="form-input"
          placeholder="Search…"
          value={search}
          onChange={e => onSearch(e.target.value)}
          style={{ paddingLeft: 34, fontSize: 13 }}
        />
        <svg style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)', width:15,height:15, color:'var(--text-muted)', pointerEvents:'none' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </div>
      {children}
    </div>
  );
}

export function Pagination({ page, total, perPage = 10, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:16, fontSize:13, color:'var(--text-secondary)' }}>
      <span>Showing {(page-1)*perPage+1}–{Math.min(page*perPage,total)} of {total}</span>
      <div style={{ display:'flex', gap:4 }}>
        <button className="btn btn-secondary btn-sm" disabled={page===1} onClick={() => onChange(page-1)}>← Prev</button>
        {Array.from({length:pages},(_, i)=>i+1).map(p => (
          <button key={p} className={`btn btn-sm ${p===page?'btn-primary':'btn-secondary'}`} onClick={() => onChange(p)}>{p}</button>
        ))}
        <button className="btn btn-secondary btn-sm" disabled={page===pages} onClick={() => onChange(page+1)}>Next →</button>
      </div>
    </div>
  );
}
