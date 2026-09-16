import type { UserRole } from "@/src/redux/features/auth/types";

export const adminWorkspaceRoles: UserRole[] = ["owner", "admin", "manager", "dispatcher", "support", "read_only"];
export const operationsWriteRoles: UserRole[] = ["owner", "admin", "manager", "dispatcher"];
export const teamManageRoles: UserRole[] = ["owner", "admin", "manager"];

export const hasRole = (role: UserRole | undefined, roles: UserRole[]) => Boolean(role && roles.includes(role));
