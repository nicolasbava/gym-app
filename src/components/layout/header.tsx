'use client';
import { signOut } from '@/src/app/actions/auth';
import { Dumbbell, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
type UserRole = 'coach' | 'member';
type CoachView = 'exercises' | 'routines' | 'members';
type MemberView = 'routines' | 'workout' | 'profile';

export default function Header() {
    // const { gymId } = useApp();
    const [hasSubscription, setHasSubscription] = useState(false);
    const [isTrialActive, setIsTrialActive] = useState(true);
    const [activePlan, setActivePlan] = useState('');
    const [assignedPrograms, setAssignedPrograms] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [openExerciseForm, setOpenExerciseForm] = useState(false);
    const [openCreateUser, setOpenCreateUser] = useState(false);
    const [trialDaysLeft, setTrialDaysLeft] = useState(30); // Simular días de prueba restantes

    const trialExpired = trialDaysLeft <= 0 && !hasSubscription;

    /////////////////////
    const [userRole, setUserRole] = useState<UserRole>('coach');
    const [coachView, setCoachView] = useState<CoachView>('exercises');
    const [memberView, setMemberView] = useState<MemberView>('routines');
    const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleStartWorkout = (routineId: string) => {
        setSelectedRoutineId(routineId);
        setMemberView('workout');
    };

    const handleEndWorkout = () => {
        setMemberView('routines');
        setSelectedRoutineId(null);
    };

    /////////////////////

    useEffect(() => {
        // Check if user just subscribed
        const urlParams = new URLSearchParams(window.location.search);
        const subscribed = urlParams.get('subscribed');
        const plan = urlParams.get('plan');

        if (subscribed === 'true') {
            setHasSubscription(true);
            setIsTrialActive(false);
            if (plan) {
                setActivePlan(plan);
            }
            // Clean URL
            window.history.replaceState({}, document.title, '/trainer-dashboard');
        }

        // Cargar programas asignados desde localStorage
        const loadAssignedPrograms = () => {
            const programs = JSON.parse(localStorage.getItem('assignedPrograms') || '[]');
            setAssignedPrograms(programs);
        };

        loadAssignedPrograms();

        // Actualizar cada 5 segundos para mostrar nuevas asignaciones
        const interval = setInterval(loadAssignedPrograms, 5000);

        return () => clearInterval(interval);
    }, [isTrialActive, trialDaysLeft]);

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Dumbbell className="w-8 h-8 text-blue-600" />
                        <h1 className="text-xl font-semibold text-gray-900">FitPro Gym</h1>
                    </div>

                    {/* Role Switcher - Demo purposes */}
                    <div className="hidden sm:flex items-center gap-2">
                        <button
                            onClick={() => setUserRole('coach')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                userRole === 'coach' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Coach View
                        </button>
                        <button
                            onClick={() => setUserRole('member')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                userRole === 'member' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Member View
                        </button>
                    </div>

                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2 rounded-lg hover:bg-gray-100">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
