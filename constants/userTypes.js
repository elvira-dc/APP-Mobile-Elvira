// User Types and Roles for Hotel Management System

// Position Types
export const POSITIONS = {
  HOTEL_ADMIN: "Hotel Admin",
  HOTEL_STAFF: "Hotel Staff",
};

// Department Types
export const DEPARTMENTS = {
  RECEPTION: "Reception",
  SECURITY: "Security",
  HOUSEKEEPING: "Housekeeping",
  KITCHEN: "Kitchen",
  MANAGEMENT: "Management",
};

// Position-Department Mapping
export const POSITION_DEPARTMENTS = {
  [POSITIONS.HOTEL_STAFF]: [
    DEPARTMENTS.RECEPTION,
    DEPARTMENTS.SECURITY,
    DEPARTMENTS.HOUSEKEEPING,
    DEPARTMENTS.KITCHEN,
  ],
  [POSITIONS.HOTEL_ADMIN]: [DEPARTMENTS.MANAGEMENT],
};

// User Role Permissions (for future use)
export const PERMISSIONS = {
  // Hotel Admin permissions
  MANAGE_ALL_TASKS: "manage_all_tasks",
  MANAGE_STAFF: "manage_staff",
  VIEW_ALL_DEPARTMENTS: "view_all_departments",
  CREATE_ANNOUNCEMENTS: "create_announcements",
  MANAGE_SCHEDULES: "manage_schedules",

  // Hotel Staff permissions
  VIEW_OWN_TASKS: "view_own_tasks",
  UPDATE_TASK_STATUS: "update_task_status",
  VIEW_MESSAGES: "view_messages",
  VIEW_SCHEDULE: "view_schedule",

  // Department-specific permissions
  MANAGE_ROOM_STATUS: "manage_room_status", // Reception
  MANAGE_SECURITY_LOGS: "manage_security_logs", // Security
  MANAGE_HOUSEKEEPING: "manage_housekeeping", // Housekeeping
  MANAGE_KITCHEN_ORDERS: "manage_kitchen_orders", // Kitchen
};

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  [POSITIONS.HOTEL_ADMIN]: [
    PERMISSIONS.MANAGE_ALL_TASKS,
    PERMISSIONS.MANAGE_STAFF,
    PERMISSIONS.VIEW_ALL_DEPARTMENTS,
    PERMISSIONS.CREATE_ANNOUNCEMENTS,
    PERMISSIONS.MANAGE_SCHEDULES,
    PERMISSIONS.VIEW_MESSAGES,
    // Plus all staff permissions
    PERMISSIONS.VIEW_OWN_TASKS,
    PERMISSIONS.UPDATE_TASK_STATUS,
    PERMISSIONS.VIEW_SCHEDULE,
  ],
  [POSITIONS.HOTEL_STAFF]: [
    PERMISSIONS.VIEW_OWN_TASKS,
    PERMISSIONS.UPDATE_TASK_STATUS,
    PERMISSIONS.VIEW_MESSAGES,
    PERMISSIONS.VIEW_SCHEDULE,
  ],
};

// Department-specific permissions
export const DEPARTMENT_PERMISSIONS = {
  [DEPARTMENTS.RECEPTION]: [PERMISSIONS.MANAGE_ROOM_STATUS],
  [DEPARTMENTS.SECURITY]: [PERMISSIONS.MANAGE_SECURITY_LOGS],
  [DEPARTMENTS.HOUSEKEEPING]: [PERMISSIONS.MANAGE_HOUSEKEEPING],
  [DEPARTMENTS.KITCHEN]: [PERMISSIONS.MANAGE_KITCHEN_ORDERS],
  [DEPARTMENTS.MANAGEMENT]: [], // Management has admin permissions
};

// User profile structure (matches Supabase tables)
// UserProfile: id, email, full_name, avatar_url, phone, created_at, updated_at
// HotelStaff: id, user_id, position, department, employee_id, hire_date, shift_start, shift_end, is_active, created_at, updated_at
// AppUser: Combined user data with staff_info, position, department, permissions

// Utility functions for role checking
export const getRolePermissions = (position, department = null) => {
  const basePermissions = ROLE_PERMISSIONS[position] || [];
  const deptPermissions = department
    ? DEPARTMENT_PERMISSIONS[department] || []
    : [];

  return [...basePermissions, ...deptPermissions];
};

export const hasPermission = (user, permission) => {
  return user.permissions?.includes(permission) || false;
};

export const isHotelAdmin = (user) => {
  return user.position === POSITIONS.HOTEL_ADMIN;
};

export const isHotelStaff = (user) => {
  return user.position === POSITIONS.HOTEL_STAFF;
};

export const getDepartmentDisplayName = (department) => {
  return DEPARTMENTS[department] || department;
};

export const getPositionDisplayName = (position) => {
  return POSITIONS[position] || position;
};

// Department colors for UI (using design system colors)
export const DEPARTMENT_COLORS = {
  [DEPARTMENTS.RECEPTION]: "#FF5A5F", // Primary coral
  [DEPARTMENTS.SECURITY]: "#00A699", // Secondary teal
  [DEPARTMENTS.HOUSEKEEPING]: "#FFB400", // Warning yellow
  [DEPARTMENTS.KITCHEN]: "#00D4AA", // Success green
  [DEPARTMENTS.MANAGEMENT]: "#0070F3", // Info blue
};

export default {
  POSITIONS,
  DEPARTMENTS,
  POSITION_DEPARTMENTS,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  DEPARTMENT_PERMISSIONS,
  DEPARTMENT_COLORS,
  getRolePermissions,
  hasPermission,
  isHotelAdmin,
  isHotelStaff,
  getDepartmentDisplayName,
  getPositionDisplayName,
};
