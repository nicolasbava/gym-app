'use client';
import { Button } from '@/src/components/ui/button';
import { Profile } from '@/src/modules/profiles/profiles.schema';
import { useProfiles } from '@/src/modules/profiles/useProfiles';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function MemberPage() {
    const { id } = useParams();
    const [memberDetails, setMemberDetails] = useState<Profile[] | null>(null);
    const { getProfileById, loadingMemberDetails, errorMemberDetails } = useProfiles();

    const getMembers = useCallback(async () => {
        if (!id) return console.error('Gym ID is required');
        const data = await getProfileById(id as string);
        setMemberDetails(data as unknown as Profile[]);
    }, [id]);

    useEffect(() => {
        getMembers();
    }, [id]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
            <div className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    {memberDetails && memberDetails.length > 0 ? (
                        <div>
                            <h1>{memberDetails[0].name} !!!!</h1>
                            <h1>{memberDetails[0].email}</h1>
                            <h1>{memberDetails[0].phone}</h1>
                            {/* <h1>{memberDetails.plan}</h1>
                        <h1>{memberDetails.last_training}</h1> */}
                            <h1>Plan del cliente</h1>
                            <h1>Último entrenamiento del cliente</h1>
                        </div>
                    ) : (
                        <div>
                            <h1>No se encontró el cliente</h1>
                        </div>
                    )}
                    <h1>-----------------------------------</h1>

                    <div className="flex items-center gap-2 justify-between">
                        <h1>Rutinas del cliente</h1>
                        <Button variant="outline">Asignar rutina</Button>
                    </div>

                    <div className="my-4">
                        <h1>lista de rutinas</h1>
                        <h1>lista de rutinas</h1>
                        <h1>lista de rutinas</h1>
                        <h1>lista de rutinas</h1>
                        <h1>lista de rutinas</h1>
                        <h1>lista de rutinas</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
