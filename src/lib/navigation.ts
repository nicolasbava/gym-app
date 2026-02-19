import { ROUTES } from '@/src/config/routes';
import { redirect } from 'next/navigation';

// Helpers for navigation
export const navigationHelpers = {
    redirectAfterLogin: () => redirect(ROUTES.AFTER_LOGIN),
    redirectAfterLoginCoach: () => redirect(ROUTES.AFTER_LOGIN_COACH),
    redirectAfterLogout: () => redirect(ROUTES.AFTER_LOGOUT),
    redirectToLogin: () => redirect(ROUTES.LOGIN),

    redirectToMember: (id: string) => redirect(ROUTES.member(id)),
    redirectToRoutine: (id: string) => redirect(ROUTES.routine(id)),
    redirectAfterWorkout: () => redirect(ROUTES.HOME),
};
