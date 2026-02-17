import { UserRole } from '@/src/config/routes';
import type { Profile } from '@/src/modules/profiles/profiles.schema';

/**
 * Check if a user role has permission to access a route
 */
export function hasRequiredRole(userRole: UserRole | null | undefined, allowedRoles?: UserRole[]): boolean {
    if (!allowedRoles || allowedRoles.length === 0) {
        return true; // No role requirement
    }
    if (!userRole) {
        return false;
    }
    return allowedRoles.includes(userRole);
}

/**
 * Check if user has a specific role
 */
export function hasRole(profile: Profile | null | undefined, role: UserRole): boolean {
    if (!profile?.role) {
        return false;
    }
    return profile.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(profile: Profile | null | undefined, roles: UserRole[]): boolean {
    if (!profile?.role) {
        return false;
    }
    const userRole = profile.role as UserRole;
    return roles.includes(userRole);
}

/**
 * Check if user is a coach (coach or coach_admin)
 */
export function isCoach(profile: Profile | null | undefined): boolean {
    return hasAnyRole(profile, ['coach', 'coach_admin']);
}

/**
 * Check if user is an admin coach
 */
export function isCoachAdmin(profile: Profile | null | undefined): boolean {
    return hasRole(profile, 'coach_admin');
}

/**
 * Check if user is a member
 */
export function isMember(profile: Profile | null | undefined): boolean {
    return hasRole(profile, 'member');
}

/**
 * Get user role from profile
 */
export function getUserRole(profile: Profile | null | undefined): UserRole | null {
    if (!profile?.role) {
        return null;
    }
    return profile.role as UserRole;
}
