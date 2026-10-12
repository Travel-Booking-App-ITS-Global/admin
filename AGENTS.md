# Admin Panel Engineering Rules (React 19 + Vite + Custom CSS)

Follow these strict rules for all code in `/admin`:

## 1. Type Safety with JSDoc
- Document all component props, custom hooks, and API data structures using JSDoc (`@typedef`, `@param`, `@returns`).
- Enable strict linting. ESLint and Prettier must pass with zero warnings.

## 2. Directory & Component Structure
- Feature-first structure:
  - `src/features/<feature>/` (`components`, `hooks`, `services`, `pages`, `constants`)
  - `src/shared/ui/` (Reusable primitive UI components)
  - `src/shared/lib/api-client/` (Centralized API client)
  - `src/shared/styles/tokens.css` (Design tokens)
- Presentational components are "dumb"; logic lives in custom hooks or services.
- Reusable UI kit in `shared/ui`: Button, Input, Select, Modal, Drawer, Table, Pagination, Badge, Toast, ConfirmDialog, EmptyState, Skeleton, FormField, PageHeader, RichTextEditor wrapper (React Quill), Chart wrappers (Recharts). Feature components must use these shared primitives.
- Wrap third-party libraries (`lucide-react`, `react-quill-new`, `recharts`) in thin wrapper components for uniform styling and maintainability.

## 3. Data & State Management
- Every data-driven view MUST handle all 4 states:
  1. **Loading** (Skeleton screens, not blank page)
  2. **Empty** (Informative empty state UI)
  3. **Error** (User-friendly message with retry button)
  4. **Success** (Rendered content)
- No direct scattered `fetch` or `axios` calls in components. Use centralized API client with token refresh & normalized error handling.
- Large tables must support server-side pagination, sorting, filtering, and debounced search.

## 4. Styling & Design Tokens
- Design tokens as CSS variables in `shared/styles/tokens.css` (colors, spacing scale, typography, radius, shadows, z-index).
- NEVER hardcode arbitrary colors, pixel sizes, or fonts in component styles.
- Modular CSS per component (CSS modules or colocated `.css` with strict BEM-like naming). No `!important`, no global selectors that pollute the namespace.
- Accessibility (WCAG AA): semantic HTML, visible focus states, proper color contrast, keyboard navigation.

## 5. Rich Text & Security
- Centralized `RichTextEditor` with standard toolbar config.
- Always sanitize HTML on server; render stored HTML only with sanitized renderers.
