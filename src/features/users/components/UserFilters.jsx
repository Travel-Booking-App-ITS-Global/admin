import React from 'react';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';

/**
 * @typedef {Object} UserFiltersProps
 * @property {string} searchTerm - Current search string
 * @property {function(string):void} onSearchChange - Search handler
 * @property {string} selectedStatus - Current status filter ('all', 'active', 'inactive', 'blocked')
 * @property {function(string):void} onStatusChange - Status change handler
 * @property {'table' | 'grid'} viewMode - Current view mode
 * @property {function('table' | 'grid'):void} onViewModeChange - View mode handler
 */

/**
 * Filter and search toolbar for users list
 * @param {UserFiltersProps} props
 */
export function UserFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
}) {
  const statuses = ['all', 'active', 'inactive', 'blocked'];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-4)',
      }}
    >
      {/* Status Pill Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {statuses.map((status) => {
          const active = selectedStatus === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusChange(status)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: active ? 600 : 500,
                border: active ? '1px solid var(--brand-500)' : '1px solid var(--border-default)',
                background: active ? 'var(--brand-500)' : 'var(--bg-card)',
                color: active ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textTransform: 'capitalize',
              }}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* Search Input & View Toggle */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flex: '1 1 280px', maxWidth: '420px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', fontSize: '0.875rem' }}
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div
          style={{
            display: 'flex',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            style={{
              padding: '8px 10px',
              border: 'none',
              background: viewMode === 'table' ? 'var(--brand-500)' : 'var(--bg-card)',
              color: viewMode === 'table' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
            title="Table View"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            style={{
              padding: '8px 10px',
              border: 'none',
              background: viewMode === 'grid' ? 'var(--brand-500)' : 'var(--bg-card)',
              color: viewMode === 'grid' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
            title="Grid View"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
