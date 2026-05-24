import { Link } from 'react-router-dom'
import { Package, CheckCircle, Users, Wrench, AlertCircle, ArrowRight } from 'lucide-react'
import { useAdminSummary } from '../hooks/useAdminSummary.js'
import { PageHeader, Spinner, Table } from '../components/index.js'
import AuditEventRow from '../components/AuditEventRow.jsx'
import { ADMIN_AUDIT_LOGS_PATH } from '../constants/routes.js'

/**
 * Admin dashboard with summary stats, assets per employee table, and recent activity preview.
 * Rendered at /admin/dashboard inside AdminLayout (admin role only).
 */
function AdminDashboardPage() {
  const { summary, isLoading, error, refetch } = useAdminSummary()

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader title="Dashboard" subtitle="Manage company assets, assignments, and support tickets" />
        <Spinner />
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader title="Dashboard" subtitle="Manage company assets, assignments, and support tickets" />
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="text-sm">{error.message || 'Failed to load dashboard'}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 text-sm font-medium underline"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  const stats = [
    {
      label: 'Total Assets',
      value: summary.total_assets,
      icon: Package,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
    },
    {
      label: 'Available',
      value: summary.available,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      label: 'Assigned',
      value: summary.assigned,
      icon: Users,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      label: 'Under Repair',
      value: summary.under_repair,
      icon: Wrench,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: 'Open Tickets',
      value: summary.open_tickets,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  const employeeColumns = [
    { 
      key: 'name', 
      label: 'Employee Name',
      render: (value, row) => (
        <div>
          <span className="font-medium text-slate-900">{row.name}</span>
          {row.email && (
            <span className="ml-1.5 text-sm text-slate-500">({row.email})</span>
          )}
        </div>
      ),
    },
    { key: 'asset_count', label: 'Asset Count' },
  ]

  const formattedEmployeeData = summary.assets_per_employee ?? []
  const recentEvents = summary.recent_events ?? []

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader title="Dashboard" subtitle="Manage company assets, assignments, and support tickets" />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Assets per Employee Table */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Assets per Employee</h2>
        {formattedEmployeeData.length > 0 ? (
          <Table columns={employeeColumns} data={formattedEmployeeData} />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-sm text-slate-500">No active assignments</p>
          </div>
        )}
      </section>

      {/* Recent Activity — latest 5 events with link to full audit logs */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <p className="mt-0.5 text-sm text-slate-500">Latest asset events across the organization</p>
          </div>
          <Link
            to={ADMIN_AUDIT_LOGS_PATH}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 sm:w-auto"
          >
            View all audit logs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentEvents.length > 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-200">
              {recentEvents.map((event) => (
                <AuditEventRow
                  key={event.id}
                  eventType={event.event_type}
                  createdAt={event.created_at}
                  triggeredByName={event.triggered_by_name}
                  targetEmployeeName={event.target_employee_name}
                  notes={event.notes}
                  assetName={event.asset_name}
                  assetId={event.asset_id}
                  showAssetName={true}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-sm text-slate-500">No recent events</p>
            <Link
              to={ADMIN_AUDIT_LOGS_PATH}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Go to audit logs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminDashboardPage
