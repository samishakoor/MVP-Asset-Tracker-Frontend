# AssetTrack — Frontend

React single-page application for **AssetTrack**, an internal asset management system. Admins manage inventory, assignments, and support tickets; employees view assigned hardware, acknowledge receipt, report issues, and browse assignment history.

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | React 19 (function components, JSX) |
| Build | Vite 8 |
| Routing | React Router 7 |
| Data fetching | TanStack React Query 5 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |

## Features

### Public

- Landing page (`/home`)
- Login and signup (`/login`, `/signup`)
- Role-based redirect after authentication (admin → dashboard, employee → dashboard)

### Admin (`/admin/*`)

- **Dashboard** — summary stats (total, available, assigned, under repair, open tickets), assets-per-employee table, recent events timeline with attribution and notes
- **Assets** — list, filter, create, edit, delete; asset detail with tabs (overview, assignments, support tickets, audit log)
- **Assignments** — assign assets to employees, update assignment status, return assets
- **Tickets** — review employee support tickets (start repair, resolve)

### Employee (`/employee/dashboard/*`)

- **Dashboard** — active assigned assets with acknowledge action and acknowledged date
- **Assignments** — view current assignments
- **Asset detail** — asset info and create support ticket
- **History** — previously returned assignments

### Shared UX

- JWT auth stored in `localStorage`; protected routes by role
- Global API loading indicator and toast notifications
- Responsive layouts (mobile-first Tailwind breakpoints)
- Brand logo (`AssetTrack`) in layout headers
- Audit event rows with event badges, relative timestamps, employee attribution (`to` / `by` / `for`), and styled event notes

## Project Structure

```
client/
├── public/                 # Static assets (favicon, icons)
├── src/
│   ├── App.jsx             # Providers: Router, React Query, Auth, toasts
│   ├── main.jsx            # Entry point
│   ├── index.css           # Tailwind import + global base styles
│   ├── routes.jsx          # AppRouter — single source of truth for routes
│   ├── constants/          # Route paths, auth roles, asset/ticket enums
│   ├── context/            # AuthProvider, ApiLoadingProvider
│   ├── hooks/              # Data hooks (useAssets, useAuth, useTickets, …)
│   ├── layouts/            # MainLayout, AuthLayout, AdminLayout, EmployeeLayout
│   ├── pages/              # Route-level screens
│   ├── components/         # Reusable UI (tables, modals, badges, AuditEventRow, …)
│   └── utils/              # api.js, datetime, event attribution/notes, toasts
├── .env                    # VITE_API_BASE_URL (not committed if sensitive)
├── index.html
├── package.json
└── vite.config.js
```

## Environment Variables

Create a `.env` file in `client/`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL for the backend API (required). All HTTP calls go through `src/utils/api.js`. |

Ensure the backend in `asset_tracker/` is running and CORS allows this origin.

## Getting Started

From the `client/` directory:

```bash
npm install
npm run dev
```

Default dev server: [http://localhost:5173](http://localhost:5173) (Vite default).

### Other scripts

| Script | Command | Purpose |
|--------|---------|---------|
| Dev | `npm run dev` | Start Vite dev server with HMR |
| Build | `npm run build` | Production build to `dist/` |
| Preview | `npm run preview` | Serve production build locally |
| Lint | `npm run lint` | Run ESLint |

## Routing

Routes are defined in `src/routes.jsx` (`AppRouter`). Path constants live in `src/constants/routes.js` — avoid hardcoding paths elsewhere.

| Area | Base path | Notes |
|------|-----------|--------|
| Public home | `/home` | Under `MainLayout` |
| Auth | `/login`, `/signup` | `AuthLayout` |
| Admin | `/admin/dashboard`, `/admin/assets`, … | `ProtectedRoute` + `AdminLayout` |
| Employee | `/employee/dashboard`, … | `ProtectedRoute` + `EmployeeLayout` |
| 404 | `*` | `NotFoundPage` |

Helper builders: `adminAssetDetailPath(id)`, `adminAssetEditPath(id)`, `employeeAssetDetailPath(id)`.

## Architecture

### Data layer

- **`apiRequest`** (`src/utils/api.js`) — central `fetch` wrapper; attaches JWT from `localStorage`, parses JSON, throws on error
- **Hooks** (`src/hooks/`) — one hook per API concern (e.g. `useAssets`, `useAssignAsset`, `useAdminSummary`); no JSX inside hooks
- **React Query** — caching and mutations in hooks; query invalidation after writes

### Auth

- **`AuthProvider`** + **`useAuth`** — login, signup, logout, current user and role
- **`ProtectedRoute`** — redirects unauthenticated users to login; enforces `admin` vs `employee` role

### UI conventions

- Pages wire data; components stay presentational where possible
- Tailwind utility classes; semantic HTML and labels on forms
- Mobile-responsive layouts on all pages and layouts

## Key Pages

| Page | Route | Role |
|------|-------|------|
| `AdminDashboardPage` | `/admin/dashboard` | Admin |
| `AssetsListPage` | `/admin/assets` | Admin |
| `AddAssetPage` / `EditAssetPage` | `/admin/assets/new`, `…/edit` | Admin |
| `AssetDetailPage` | `/admin/assets/:id` | Admin |
| `AssignmentsPage` | `/admin/assignments` | Admin |
| `TicketsListPage` | `/admin/tickets` | Admin |
| `EmployeeDashboardPage` | `/employee/dashboard` | Employee |
| `EmployeeAssignmentsPage` | `/employee/dashboard/assignments` | Employee |
| `EmployeeAssetDetailPage` | `/employee/dashboard/assets/:assetId` | Employee |
| `EmployeeHistoryPage` | `/employee/dashboard/history` | Employee |

## Related Documentation

- Backend API and database: `../asset_tracker/README.md`
- UI and routing rules for contributors: `../.cursor/rules/ui_guidelines.mdc`
