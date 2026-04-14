export enum Role {
  ADMIN = 'ADMIN',
  MERCHANT = 'MERCHANT',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

export const PERMISSIONS: Record<Role, string[]> = {
  [Role.ADMIN]: [
    'manage_users', 'manage_shops', 'manage_staff', 'view_logs', 'manage_plans',
    'manage_payments', 'view_analytics_all', 'suspend_shops', 'manage_support'
  ],
  [Role.MERCHANT]: [
    'manage_shop', 'manage_staff', 'view_analytics', 'manage_campaigns',
    'manage_rewards', 'manage_giftcards', 'export_data', 'view_logs_self'
  ],
  [Role.STAFF]: [
    'stamp_points', 'redeem_rewards', 'view_customers', 'view_analytics_basic', 'manage_rewards'
  ],
  [Role.CUSTOMER]: [
    'view_points', 'view_rewards', 'redeem_rewards', 'view_giftcards'
  ],
}

export function hasPermission(role: Role, permission: string): boolean {
  return PERMISSIONS[role]?.includes(permission) ?? false
}

export function canAccess(role: Role, requiredPermissions: string[]): boolean {
  return requiredPermissions.every(p => hasPermission(role, p))
}
