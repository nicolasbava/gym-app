'use client';

import RoutinesProfile from '@/src/components/profile/profile-routines';
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';
import type { Profile } from '@/src/modules/profiles/profiles.schema';
import { useProfiles } from '@/src/modules/profiles/useProfiles';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MemberPage() {
    const { id } = useParams();
    const [member, setMember] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { getProfileById } = useProfiles();

    useEffect(() => {
        if (!id || typeof id !== 'string') {
            setLoading(false);
            return;
        }
        let cancelled = false;
        setLoading(true);
        setError(null);
        getProfileById(id)
            .then((data) => {
                if (!cancelled) setMember(data ?? null);
            })
            .catch((err) => {
                if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="space-y-8">
                    <Link
                        href="/trainer-dashboard"
                        className="inline-flex items-center gap-2 text-sm text-purple-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al dashboard
                    </Link>

                    {loading ? (
                        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-20 w-20 rounded-full bg-purple-800/40" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-7 w-48 bg-purple-800/40" />
                                        <Skeleton className="h-4 w-64 bg-purple-800/40" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-10 w-full bg-purple-800/40" />
                                <Skeleton className="h-10 w-full bg-purple-800/40" />
                                <Skeleton className="h-10 w-3/4 bg-purple-800/40" />
                            </CardContent>
                        </Card>
                    ) : error ? (
                        <Card className="bg-red-950/30 border-red-500/30">
                            <CardContent className="pt-6">
                                <p className="text-red-200 font-medium">No se pudo cargar el cliente</p>
                                <p className="text-red-300/80 text-sm mt-1">{error.message}</p>
                                <Button variant="outline" size="sm" className="mt-4 border-red-500/50 text-red-200 hover:bg-red-900/20" asChild>
                                    <Link href="/trainer-dashboard">Volver</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : !member ? (
                        <Card className="bg-black/40 border-purple-800/30">
                            <CardContent className="pt-6">
                                <p className="text-purple-200">No se encontró el cliente.</p>
                                <Button variant="outline" size="sm" className="mt-4 border-purple-800/50 text-purple-300" asChild>
                                    <Link href="/trainer-dashboard">Volver al dashboard</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm overflow-hidden">
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                        <Avatar className="h-20 w-20 border-2 border-purple-500/30">
                                            {member.image_url ? (
                                                <AvatarImage src={member.image_url} alt={member.name} className="object-cover" />
                                            ) : null}
                                            {/* <AvatarFallback className="bg-purple-600 text-white text-2xl">
                                                {member.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </AvatarFallback> */}
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <CardTitle className="text-2xl text-white flex items-center gap-2">
                                                <User className="h-6 w-6 text-purple-400" />
                                                {member.name}
                                            </CardTitle>
                                            <CardDescription className="text-purple-200/90">Cliente · Perfil de entrenamiento</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-1">
                                    <div className="flex items-center gap-3 py-3 border-b border-purple-800/30">
                                        <Mail className="h-5 w-5 text-purple-400 shrink-0" />
                                        <div>
                                            <p className="text-xs font-medium text-purple-300/80">Email</p>
                                            <p className="text-white">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 py-3 border-b border-purple-800/30">
                                        <Phone className="h-5 w-5 text-purple-400 shrink-0" />
                                        <div>
                                            <p className="text-xs font-medium text-purple-300/80">Teléfono</p>
                                            <p className="text-white">{member.phone ?? '—'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <div>
                                        <CardTitle className="text-xl text-white">Rutinas asignadas</CardTitle>
                                        <CardDescription className="text-purple-200/90">Rutinas activas de este cliente</CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-purple-600 text-purple-300 hover:bg-purple-900/20 shrink-0"
                                        asChild
                                    >
                                        <Link href="/trainer-dashboard?tab=routines">Asignar rutina</Link>
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <RoutinesProfile profileId={member.id} />
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
