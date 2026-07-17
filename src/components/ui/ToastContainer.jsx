import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../store/AppContext';

const ICONS = {
  success: { icon: CheckCircle, color: 'var(--success-500)' },
  error:   { icon: XCircle,     color: 'var(--danger-500)' },
  warning: { icon: AlertTriangle, color: 'var(--warning-500)' },
  info:    { icon: Info,        color: 'var(--brand-500)' },
};

export default function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="toast-container">
      {toasts.map(t => {
        const cfg = ICONS[t.type] || ICONS.info;
        return (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <cfg.icon size={18} color={cfg.color} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{t.message}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
