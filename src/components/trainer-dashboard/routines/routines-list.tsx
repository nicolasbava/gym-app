import { Button } from '@/src/components/ui/button';
import { useApp } from '@/src/contexts/AppContext';
import { Routine } from '@/src/modules/routines/routines.schema';
import { useRoutines } from '@/src/modules/routines/useRoutines';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function RoutinesList() {
    const router = useRouter();
    const { gymId } = useApp();
    console.log('gymId', gymId);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const { getRoutinesByGym, loading, error } = useRoutines();

    const getRoutines = useCallback(async () => {
        if (!gymId) return console.error('Gym ID is required');
        const data = await getRoutinesByGym(gymId);
        console.log('routines data', data);
        setRoutines(data as Routine[]);
    }, [gymId]);

    useEffect(() => {
        console.log('gymId', gymId);
        getRoutines();
    }, [gymId]);

    const handleMemberDetails = (id: string) => {
        router.push(`/member/${id}`);
    };

    if (loading) return <div>Cargando RoutinesList...</div>;

    return (
        <>
            {routines.map((routine, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-purple-900/20 rounded-lg cursor-pointer">
                    <div className="flex items-center space-x-3">
                        {/* <Avatar>
                            <AvatarFallback className="bg-purple-600">
                                {routine.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </AvatarFallback>
                        </Avatar> */}
                        <div>
                            <h4 className="text-white font-medium">{routine.name}</h4>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/assign-program">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Ver
                            </Button>
                        </Link>
                    </div>
                </div>
            ))}
        </>
    );
}

{
    /* <div>
<h4 className="text-white font-medium">{member.name}</h4>
<p className="text-sm text-purple-300">
    Plan {member.plan} • {member.lastWorkout}
</p>
</div> */
}

{
    /* <div className="text-right">
<p className="text-white">{member.progress}%</p>
<Progress value={member.progress} className="w-20 mt-1" />
</div> */
}
