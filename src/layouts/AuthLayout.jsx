import { Navigate, Outlet } from 'react-router-dom'
import { CheckCircle2, Package, ShieldCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import BrandLogo from '../components/BrandLogo.jsx'
import AssetTrackLogoIcon from '../components/AssetTrackLogoIcon.jsx'
import {
  ADMIN_DASHBOARD_PATH,
  EMPLOYEE_DASHBOARD_PATH,
  LOGIN_PAGE_LINK,
  VERIFY_EMAIL_PAGE_LINK,
} from '../constants/routes.js'
import { UserRole } from '../constants/auth.js'

const BRAND_FEATURES = [
  { icon: Package, text: 'Track laptops, monitors, and assigned hardware' },
  { icon: ShieldCheck, text: 'Acknowledge custody and return assets securely' },
  { icon: CheckCircle2, text: 'Open support tickets when something needs attention' },
]

/**
 * Split auth layout with brand panel and centered form area.
 * Redirects authenticated users to their role-specific dashboard.
 */
function AuthLayout() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    if (user.isVerified === false) {
      return (
        <Navigate
          to={VERIFY_EMAIL_PAGE_LINK}
          replace
          state={{ email: user.email, fromLogin: true }}
        />
      )
    }

    if (user.role === UserRole.ADMIN) {
      return <Navigate to={ADMIN_DASHBOARD_PATH} replace />
    }
    return <Navigate to={EMPLOYEE_DASHBOARD_PATH} replace />
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-700 to-emerald-900 lg:flex lg:w-[44%] lg:min-h-screen lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute -right-16 top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-24 left-8 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col px-10 py-10 xl:px-14 xl:py-12">
          <div className="inline-flex items-center gap-2.5">
            <AssetTrackLogoIcon className="h-8 w-8 shrink-0 text-white" />
            <span className="text-xl font-bold text-white">AssetTrack</span>
          </div>
          <div className="mt-16 max-w-md">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100/90">
              Asset management
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white xl:text-4xl">
              Know what you have, who has it, and where it stands.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-emerald-50/90">
              AssetTrack helps your team manage assignments, acknowledgments, and support in one
              place.
            </p>
          </div>
          <ul className="mt-12 space-y-4">
            {BRAND_FEATURES.map(function renderFeature(feature) {
              const Icon = feature.icon
              return (
                <li key={feature.text} className="flex items-start gap-3 text-emerald-50">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm leading-relaxed">{feature.text}</span>
                </li>
              )
            })}
          </ul>
        </div>
        <p className="relative z-10 px-10 pb-10 text-xs text-emerald-100/70 xl:px-14">
          Secure access for admins and employees
        </p>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col bg-slate-50">
        <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4 sm:px-6">
            <BrandLogo to={LOGIN_PAGE_LINK} variant="emerald" size="md" />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:max-w-none lg:px-10 xl:px-16">
          <div className="mx-auto w-full max-w-md lg:max-w-lg">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AuthLayout
