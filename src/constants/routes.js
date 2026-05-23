export const LANDING_PAGE_LINK = '/'
export const HOME_PAGE_LINK = 'home'
export const HOME_PAGE_PATH = '/home'
export const LOGIN_PAGE_LINK = '/login'
export const SIGNUP_PAGE_LINK = '/signup'
export const FORGOT_PASSWORD_PAGE_LINK = '/forgot-password'
export const RESET_PASSWORD_PAGE_LINK = '/reset-password'
export const VERIFY_EMAIL_PAGE_LINK = '/verify-email'
export const ADMIN_BASE_PATH = '/admin'
export const ADMIN_DASHBOARD_LINK = 'dashboard'
export const ADMIN_DASHBOARD_PATH = '/admin/dashboard'
export const ADMIN_ASSETS_LINK = 'assets'
export const ADMIN_ASSETS_PATH = '/admin/assets'
export const ADMIN_ASSETS_NEW_LINK = 'assets/new'
export const ADMIN_ASSETS_NEW_PATH = '/admin/assets/new'
export const ADMIN_ASSET_DETAIL_LINK = 'assets/:id'
export const ADMIN_ASSET_EDIT_LINK = 'assets/:id/edit'
export const ADMIN_ASSIGNMENTS_LINK = 'assignments'
export const ADMIN_ASSIGNMENTS_PATH = '/admin/assignments'
export const ADMIN_TICKETS_LINK = 'tickets'
export const ADMIN_TICKETS_PATH = '/admin/tickets'
export const EMPLOYEE_DASHBOARD_PATH = '/employee/dashboard'
export const EMPLOYEE_ASSIGNMENTS_LINK = 'assignments'
export const EMPLOYEE_ASSIGNMENTS_PATH = '/employee/dashboard/assignments'
export const EMPLOYEE_HISTORY_LINK = 'history'
export const EMPLOYEE_HISTORY_PATH = '/employee/dashboard/history'
export const EMPLOYEE_ASSET_DETAIL_LINK = 'assets/:assetId'
export const EMPLOYEE_ASSET_DETAIL_PATH = '/employee/dashboard/assets/:assetId'

export function adminAssetDetailPath(assetId) {
  return `/admin/assets/${assetId}`
}

export function adminAssetEditPath(assetId) {
  return `/admin/assets/${assetId}/edit`
}

export function employeeAssetDetailPath(assetId) {
  return `/employee/dashboard/assets/${assetId}`
}
export const NOT_FOUND = '*'
